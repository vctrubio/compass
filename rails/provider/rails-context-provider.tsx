import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { User, SupabaseClient } from "@supabase/supabase-js";
import { ALL_TABLE_NAMES } from "@/rails/routes";
import { TableEntity } from "@/rails/types";
import { fetchTablesDataFromDb } from "@/rails/src/db_fetch";

export interface RailsContextType {
    user: User | null;
    signOut: () => Promise<void>;
    isLoading: boolean;
    listTables: string[];
    tables: Record<string, TableEntity>;
    fetchTables: (tableNames: string[]) => Promise<Record<string, TableEntity>>;
    supabaseClient: SupabaseClient;
}

const RailsProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tables, setTables] = useState<Record<string, TableEntity>>({});
    const [loadedTables, setLoadedTables] = useState<Set<string>>(new Set());
    const supabase = createClient();
    const tablesToFetch = [...ALL_TABLE_NAMES];

    // Create a memoized fetchTables function to pass down to children
    const fetchTables = useCallback(async (tableNames: string[]): Promise<Record<string, TableEntity>> => {
        try {
            // Filter out tables that have already been loaded to prevent duplicates
            const tablesToLoad = tableNames.filter(name => !loadedTables.has(name));
            
            if (tablesToLoad.length === 0) {
                console.log('All requested tables are already loaded');
                // Return the subset of tables that were requested
                const requestedTables: Record<string, TableEntity> = {};
                tableNames.forEach(name => {
                    if (tables[name]) {
                        requestedTables[name] = tables[name];
                    }
                });
                return requestedTables;
            }
            
            console.log(`Parent context fetching tables: ${tablesToLoad.join(', ')}`);
            const fetchedTables = await fetchTablesDataFromDb(supabase, tablesToLoad);
            
            // Update our state with the new tables
            setTables(prevTables => ({
                ...prevTables,
                ...fetchedTables
            }));
            
            // Mark these tables as loaded
            setLoadedTables(prev => {
                const newSet = new Set(prev);
                tablesToLoad.forEach(name => newSet.add(name));
                return newSet;
            });
            
            return fetchedTables;
        } catch (error) {
            console.error("Error fetching tables:", error);
            return {};
        }
    }, [supabase, tables, loadedTables]);

    useEffect(() => {
        (async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    console.error('Error fetching user:', error);
                    setUser(null);
                } else {
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Unexpected error:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        })();

        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
            }
        );

        // Clean up listener on unmount
        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [supabase]);

    // Fetch core tables only once when app loads
    useEffect(() => {
        if (!isLoading && user) {
            // Fetch only the core tables needed for all users
            const coreTables = ['students', 'teachers']; // Define your core tables here
            
            fetchTables(coreTables).then(() => {
                console.log('Initial core tables loaded');
            });
        }
    }, [isLoading, user, fetchTables]);

    const signOut = async () => {
        console.log("Signing out from Rails context...");
        await signOutAction();
    };

    // Only access window in client components and when it's available
    if (typeof window !== 'undefined') {
        window.test1 = 'test1';
        window.user = user;
        window.isLoading = isLoading;
        window.tss = tablesToFetch;
        window.tables = tables;
    }

    const contextValue = {
        user,
        signOut,
        isLoading,
        listTables: tablesToFetch,
        tables,
        fetchTables,
        supabaseClient: supabase,
    };

    return (
        <RailsContext.Provider value={contextValue}>
            {children}
        </RailsContext.Provider>
    );
}

export const RailsContext = createContext<RailsContextType | undefined>(undefined);
export const useRailsContext = () => {
    const context = useContext(RailsContext);
    if (!context) {
        throw new Error("useRailsContext must be used within a RailsProvider");
    }
    return context;
}

export default RailsProvider;