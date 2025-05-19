"use client";

import { createContext, useContext, useState } from "react";
import RailsProvider, { RailsContext, useRailsContext, RailsContextType } from './rails-context-provider';
// Global types are now imported from rails/types.d.ts

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
  
  // Add admin-specific state
  const [isAdmin] = useState<boolean>(true); // Default to true as requested
  
  // Only access window in client components and when it's available
  if (typeof window !== 'undefined') {
    window.isadmin = isAdmin; // Expose isAdmin to the window object for debugging
  }
  return (
    <AdminContext.Provider value={{ 
      ...railsContext, // Spread all properties from railsContext
      isAdmin // Add the admin-specific property
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