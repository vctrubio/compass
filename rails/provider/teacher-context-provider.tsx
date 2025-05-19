"use client";

import { createContext, useContext, useState, useEffect } from "react";
import RailsProvider, { RailsContext, useRailsContext, RailsContextType } from './rails-context-provider';
import { TEACHERS_TABLE_NAMES } from '@/rails/routes';
import { fetchTableDataFromDb } from "@/rails/src/db_fetch";
import { createClient } from "@/utils/supabase/client";

interface TeacherContextType extends RailsContextType {
  teacherData: any | null;
  isFetchingTeacher: boolean;
}

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
  const { user, isLoading } = railsContext;
  
  const [teacherData, setTeacherData] = useState<any | null>(null);
  const [isFetchingTeacher, setIsFetchingTeacher] = useState<boolean>(false);
  const supabase = createClient();
  
  useEffect(() => {
    if (user && user.id) {
      const fetchTeacherData = async () => {
        try {
          setIsFetchingTeacher(true);
          console.log(`User detected inside teacher context. Fetching teacher data for user ID: ${user.id}`);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          setTeacherData({
            id: `teacher-${user.id}`,
            name: user.email?.split('@')[0] || 'Unknown Teacher',
            specialization: 'Math',
            yearsExperience: 5,
          });
          
        } catch (error) {
          console.error('Error fetching teacher data:', error);
          setTeacherData(null);
        } finally {
          setIsFetchingTeacher(false);
        }
      };
      
      fetchTeacherData();
    }
  }, [user]);
  
  useEffect(() => {
    if (user && !isLoading) {
      console.log('Teacher user detected. Fetching teacher-specific tables...');
      
      const tablesToFetch = [...TEACHERS_TABLE_NAMES];
      
      const fetchTeacherTables = async () => {
        try {
          console.log(`Teacher context will fetch data for: ${tablesToFetch.join(', ')}`);
          
          const fetchPromises = tablesToFetch.map(async (tableName) => {
            console.log(`Teacher context requesting data for table: ${tableName}`);
            return await fetchTableDataFromDb(supabase, tableName);
          });
          
          await Promise.all(fetchPromises);
          console.log('Teacher tables fetch complete');
        } catch (error) {
          console.error("Error fetching teacher tables:", error);
        }
      };
      
      fetchTeacherTables();
    }
  }, [user, isLoading, supabase]);
  
  return (
    <TeacherContext.Provider value={{ 
      ...railsContext,
      teacherData,
      isFetchingTeacher,
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