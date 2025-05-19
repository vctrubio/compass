"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import RailsProvider, { RailsContext, useRailsContext, RailsContextType } from './rails-context-provider';
import { STUDENTS_TABLE_NAMES } from '@/rails/routes';

// Student context just extends Rails context without additional properties
interface StudentContextType extends RailsContextType {}

const StudentProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RailsProvider>
      <StudentProviderInner>
        {children}
      </StudentProviderInner>
    </RailsProvider>
  );
}

const StudentProviderInner = ({ children }: { children: React.ReactNode }) => {
  const railsContext = useRailsContext();
  const { user, isLoading, fetchTables } = railsContext;
  
  // Use ref to track if tables have been fetched
  const tablesLoadedRef = useRef(false);
  
  // Only fetch student-specific tables once
  useEffect(() => {
    if (user && !isLoading && !tablesLoadedRef.current) {
      console.log('Student user detected. Fetching student-specific tables...');
      
      const tablesToFetch = [...STUDENTS_TABLE_NAMES];
      
      const fetchStudentTables = async () => {
        try {
          console.log(`Student context requesting tables: ${tablesToFetch.join(', ')}`);
          await fetchTables(tablesToFetch);
          tablesLoadedRef.current = true;
          console.log('Student tables fetch complete');
        } catch (error) {
          console.error("Error fetching student tables:", error);
        }
      };
      
      fetchStudentTables();
    }
  }, [user, isLoading, fetchTables]);
  
  return (
    <StudentContext.Provider value={{ 
      ...railsContext,
      listTables: [...STUDENTS_TABLE_NAMES]
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentContext must be used within a StudentProvider");
  }
  return context;
}

export default StudentProvider;