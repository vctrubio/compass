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
  console.log('👑 AdminProvider: Initializing');
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
    console.log('👑 AdminProvider: Checking conditions for table fetch:', {
      hasUser: !!user,
      isLoading,
      isAdmin,
      tablesLoaded: tablesLoadedRef.current
    });

    if (user && !isLoading && isAdmin && !tablesLoadedRef.current) {
      console.log('👑 AdminProvider: Starting admin table fetch');
      
      const fetchAdminTables = async () => {
        try {
          console.log('👑 AdminProvider: Fetching admin tables:', tablesToFetch);
          await fetchTables(tablesToFetch);
          tablesLoadedRef.current = true;
          console.log('✅ AdminProvider: Admin tables fetch complete');
        } catch (error) {
          console.error("❌ AdminProvider: Error fetching admin tables:", error);
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