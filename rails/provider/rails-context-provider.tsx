import { createContext, useContext, useState, useEffect } from "react";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { ALL_TABLE_NAMES } from "@/rails/routes";
// Global types are now imported from rails/types.d.ts
import { TableField, Table } from "@/rails/types";

export interface RailsContextType {
    user: User | null; // Properly typed Supabase user object
    signOut: () => Promise<void>;
    isLoading: boolean; // Flag to indicate if user data is still loading
    listTables: string[]; // List of available tables
    tables: {
        listTables: Record<string, Table>;
    };
    // fetchTableDataFromDb removed from here
}


const RailsProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tables, setTables] = useState<{ listTables: Record<string, Table> }>({ 
        listTables: {} 
    });
    const supabase = createClient();
    const tablesToFetch = [...ALL_TABLE_NAMES];

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

    const signOut = async () => {
        console.log("Signing out from Rails context...");
        // Call the server action to sign out
        await signOutAction();
        // Local state will be updated via the auth listener
    };

    // Function removed and moved to db_fetch.ts

    // Only access window in client components and when it's available
    if (typeof window !== 'undefined') {
        window.test1 = 'test1';
        window.user = user;
        window.isLoading = isLoading;
        window.tss = tablesToFetch
    }

    // Create a value object with all the context data
    const contextValue = {
        user,
        signOut,
        isLoading,
        listTables: tablesToFetch, // Spread the array to create a copy
        tables, // The structured table information
        // fetchTableDataFromDb removed from here
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