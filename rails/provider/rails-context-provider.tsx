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
            console.log('🔍 RailsProvider: fetchTables called with tables:', tableNames);
            console.log('📊 RailsProvider: Currently loaded tables:', Array.from(loadedTables));
            
            // Filter out tables that have already been loaded to prevent duplicates
            const tablesToLoad = tableNames.filter(name => !loadedTables.has(name));
            
            if (tablesToLoad.length === 0) {
                console.log('✅ RailsProvider: All requested tables already loaded');
                // Return the subset of tables that were requested
                const requestedTables: Record<string, TableEntity> = {};
                tableNames.forEach(name => {
                    if (tables[name]) {
                        requestedTables[name] = tables[name];
                    }
                });
                return requestedTables;
            }
            
            console.log('🔄 RailsProvider: Fetching new tables:', tablesToLoad);
            const fetchedTables = await fetchTablesDataFromDb(supabase, tablesToLoad);
            
            // Update our state with the new tables
            setTables(prevTables => {
                console.log('📝 RailsProvider: Updating tables state with:', Object.keys(fetchedTables));
                return {
                    ...prevTables,
                    ...fetchedTables
                };
            });
            
            // Mark these tables as loaded
            setLoadedTables(prev => {
                const newSet = new Set(prev);
                tablesToLoad.forEach(name => newSet.add(name));
                console.log('📚 RailsProvider: Updated loaded tables:', Array.from(newSet));
                return newSet;
            });
            
            return fetchedTables;
        } catch (error) {
            console.error("❌ RailsProvider: Error fetching tables:", error);
            return {};
        }
    }, [supabase, tables, loadedTables]);

    useEffect(() => {
        console.log('👤 RailsProvider: Initializing user state');
        (async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    console.error('❌ RailsProvider: Error fetching user:', error);
                    setUser(null);
                } else {
                    console.log('✅ RailsProvider: User loaded:', data.user?.email);
                    setUser(data.user);
                }
            } catch (error) {
                console.error('❌ RailsProvider: Unexpected error:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        })();

        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('🔄 RailsProvider: Auth state changed:', event);
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
            console.log('📚 RailsProvider: Loading core tables for user:', user.email);
            // Fetch only the core tables needed for all users
            const coreTables = ['students', 'teachers']; // Define your core tables here
            fetchTables(coreTables);
        }
    }, [isLoading, user, fetchTables]);

    const signOut = async () => {
        console.log('👋 RailsProvider: Signing out user');
        await signOutAction();
    };

    const contextValue = {
        user,
        signOut,
        isLoading,
        listTables: tablesToFetch,
        tables,
        fetchTables,
        supabaseClient: supabase,
    };

//   window.ptr = tables;

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