"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import RailsProvider, { RailsContext, useRailsContext, RailsContextType } from './rails-context-provider';
import { TEACHERS_TABLE_NAMES } from '@/rails/routes';

// Teacher context just extends Rails context without additional properties
interface TeacherContextType extends RailsContextType {}

const TeacherProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RailsProvider>
      <TeacherProviderInner>
        {children}
      </TeacherProviderInner>
    </RailsProvider>
  );
}

const TeacherProviderInner = ({ children }: { children: React.ReactNode }) => {
  const railsContext = useRailsContext();
  const { user, isLoading, fetchTables } = railsContext;
  
  // Use ref to track if tables have been fetched
  const tablesLoadedRef = useRef(false);
  
  // Only fetch teacher-specific tables once
  useEffect(() => {
    if (user && !isLoading && !tablesLoadedRef.current) {
      console.log('Teacher user detected. Fetching teacher-specific tables...');
      
      const tablesToFetch = [...TEACHERS_TABLE_NAMES];
      
      const fetchTeacherTables = async () => {
        try {
          console.log(`Teacher context requesting tables: ${tablesToFetch.join(', ')}`);
          await fetchTables(tablesToFetch);
          tablesLoadedRef.current = true;
          console.log('Teacher tables fetch complete');
        } catch (error) {
          console.error("Error fetching teacher tables:", error);
        }
      };
      
      fetchTeacherTables();
    }
  }, [user, isLoading, fetchTables]);
  
  return (
    <TeacherContext.Provider value={{ 
      ...railsContext,
      listTables: [...TEACHERS_TABLE_NAMES]
    }}>
      {children}
    </TeacherContext.Provider>
  );
}

export const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const useTeacherContext = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacherContext must be used within a TeacherProvider");
  }
  return context;
}

export default TeacherProvider;