"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import RailsProvider, { RailsContext, useRailsContext, RailsContextType } from './rails-context-provider';
import { ADMIN_TABLE_NAMES } from '@/rails/routes';

// Extend the RailsContextType with admin-specific properties
interface AdminContextType extends RailsContextType {
  isAdmin: boolean;
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
  const [isAdmin] = useState<boolean>(true);
  const { user, isLoading, fetchTables } = railsContext;
  
  // Use ref to track if tables have been fetched
  const tablesLoadedRef = useRef(false);
  
  // Fetch admin-specific tables data only once
  useEffect(() => {
    if (user && !isLoading && isAdmin && !tablesLoadedRef.current) {
      console.log('Admin user detected. Fetching admin-specific tables...');
      
      const fetchAdminTables = async () => {
        try {
          console.log(`Admin context will fetch data for: ${tablesToFetch.join(', ')}`);
          await fetchTables(tablesToFetch);
          tablesLoadedRef.current = true;
          console.log('Admin tables fetch complete');
        } catch (error) {
          console.error("Error fetching admin tables:", error);
        }
      };
      
      // Execute the fetch function
      fetchAdminTables();
    }
  }, [user, isLoading, isAdmin, fetchTables, tablesToFetch]);
  
  // Only access window in client components and when it's available
  if (typeof window !== 'undefined') {
    window.isadmin = isAdmin;
  }
  
  return (
    <AdminContext.Provider value={{ 
      ...railsContext,
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