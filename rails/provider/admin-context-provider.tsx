"use client";

import { createContext, useContext, useState, useEffect } from "react";
import RailsProvider, { RailsContext, useRailsContext, RailsContextType } from './rails-context-provider';
import { ADMIN_TABLE_NAMES } from '@/rails/routes';
import { fetchTableDataFromDb } from "@/rails/src/db_fetch";
import { createClient } from "@/utils/supabase/client";

// Extend the RailsContextType with admin-specific properties
interface AdminContextType extends RailsContextType {
  isAdmin: boolean; // Add admin-specific property
}

// Define the AdminProvider component that wraps RailsProvider
const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  // We'll use the RailsProvider's context as a base
  return (
    <RailsProvider>
      <AdminProviderInner>
        {children}
      </AdminProviderInner>
    </RailsProvider>
  );
}

// Inner component that consumes RailsContext and provides AdminContext
const AdminProviderInner = ({ children }: { children: React.ReactNode }) => {
  // Get the base context from RailsProvider
  const railsContext = useRailsContext();
  const tablesToFetch = [...ADMIN_TABLE_NAMES];
  
  // Add admin-specific state
  const [isAdmin] = useState<boolean>(true); // Default to true as requested
  const { user, isLoading } = railsContext;
  const supabase = createClient();
  
  // Fetch admin-specific tables data - with batch processing to prevent re-renders
  useEffect(() => {
    if (user && !isLoading && isAdmin) {
      console.log('Admin user detected. Fetching admin-specific tables...');
      
      // Define an async function to fetch all tables in batch
      const fetchAdminTables = async () => {
        try {
          console.log(`Admin context will fetch data for: ${tablesToFetch.join(', ')}`);
          
          // Create an array of promises for all table fetches
          const fetchPromises = tablesToFetch.map(async (tableName) => {
            console.log(`Admin context requesting data for table: ${tableName}`);
            return await fetchTableDataFromDb(supabase, tableName);
          });
          
          // Wait for all promises to resolve, but don't do anything with results
          // as the RailsContext will handle state updates
          await Promise.all(fetchPromises);
          console.log('Admin tables fetch complete');
        } catch (error) {
          console.error("Error fetching admin tables:", error);
        }
      };
      
      // Execute the fetch function
      fetchAdminTables();
    }
  }, [user, isLoading, isAdmin, supabase]);
  
  // Only access window in client components and when it's available
  if (typeof window !== 'undefined') {
    window.isadmin = isAdmin; // Expose isAdmin to the window object for debugging
    window.atables = tablesToFetch; // Expose tablesToFetch to the window object for debugging
  }
  
  return (
    <AdminContext.Provider value={{ 
      ...railsContext, // Spread all properties from railsContext
      listTables: tablesToFetch,
      isAdmin,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

// Create and export the context
export const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Custom hook for using the admin context
export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}

// Export the RailsContextType so it can be used without additional import
export type { RailsContextType };

export default AdminProvider;