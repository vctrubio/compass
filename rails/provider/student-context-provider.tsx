"use client";

import { createContext, useContext, useState, useEffect } from "react";
import RailsProvider, { RailsContext, useRailsContext, RailsContextType } from './rails-context-provider';
import { STUDENTS_TABLE_NAMES } from '@/rails/routes';
import { fetchTableDataFromDb } from "@/rails/src/db_fetch";
import { createClient } from "@/utils/supabase/client";

interface StudentContextType extends RailsContextType {
  studentData: any | null;
  isFetchingStudent: boolean;
}

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
  const { user, isLoading } = railsContext;
  
  const [studentData, setStudentData] = useState<any | null>(null);
  const [isFetchingStudent, setIsFetchingStudent] = useState<boolean>(false);
  const supabase = createClient();
  
  useEffect(() => {
    if (user && user.id) {
      const fetchStudentData = async () => {
        try {
          setIsFetchingStudent(true);
          console.log(`User detected inside student context. Fetching student data for user ID: ${user.id}`);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          setStudentData({
            id: `student-${user.id}`,
            name: user.email?.split('@')[0] || 'Unknown Student',
            grade: '10',
          });
          
        } catch (error) {
          console.error('Error fetching student data:', error);
          setStudentData(null);
        } finally {
          setIsFetchingStudent(false);
        }
      };
      
      fetchStudentData();
    }
  }, [user]);
  
  useEffect(() => {
    if (user && !isLoading) {
      console.log('Student user detected. Fetching student-specific tables...');
      
      const tablesToFetch = [...STUDENTS_TABLE_NAMES];
      
      const fetchStudentTables = async () => {
        try {
          console.log(`Student context will fetch data for: ${tablesToFetch.join(', ')}`);
          
          const fetchPromises = tablesToFetch.map(async (tableName) => {
            console.log(`Student context requesting data for table: ${tableName}`);
            return await fetchTableDataFromDb(supabase, tableName);
          });
          
          await Promise.all(fetchPromises);
          console.log('Student tables fetch complete');
        } catch (error) {
          console.error("Error fetching student tables:", error);
        }
      };
      
      fetchStudentTables();
    }
  }, [user, isLoading, supabase]);
  
  return (
    <StudentContext.Provider value={{ 
      ...railsContext,
      studentData,
      isFetchingStudent,
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