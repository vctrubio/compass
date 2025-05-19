'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'
import { DB_SCHEMAS, getTableSchema } from './db-types'

// Type for table field information
interface TableField {
  name: string;
  type: string;
  required: boolean;
  isPrimaryKey: boolean;
}

// Enhanced table interface with CRUD operations and metadata
export interface DbTable<T = any> {
  name: string;
  data: T[];
  fields: TableField[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  get: () => T[];
  getById: (id: string) => T | undefined;
  add: (record: Partial<T>) => Promise<{ data: T | null; error: string | null }>;
  update: (id: string, updates: Partial<T>) => Promise<{ success: boolean; error: string | null }>;
  destroy: (id: string) => Promise<{ success: boolean; error: string | null }>;
  
  // Utility methods
  refresh: () => Promise<void>;
  query: (queryFn: (query: any) => any) => Promise<{ data: any; error: any }>;
}

type DbContextType = {
  tables: { [key: string]: DbTable };
};

// Create the context with a default empty value
const DbContext = createContext<DbContextType>({ tables: {} });

// Hook for child components to get the context values
export const useDb = () => useContext(DbContext);

// Provider component that wraps parts of the app that need DB access
export function DbProvider({ children }: { children: ReactNode }) {
  // Use an object for tables to make lookups easier
  const [tablesObj, setTablesObj] = useState<{ [key: string]: DbTable }>({});
  
  // Function to get table schema metadata from DB_SCHEMAS
  const fetchTableSchema = async (tableName: string): Promise<TableField[]> => {
    const schema = getTableSchema(tableName);
    
    if (schema) {
      // Convert the schema columns to TableField array format
      const fields: TableField[] = Object.entries(schema.tableColumns).map(([fieldName, fieldType]) => ({
        name: fieldName,
        type: fieldType as string,
        required: schema.requiredFields?.includes(fieldName) || false,
        isPrimaryKey: schema.primaryKey === fieldName
      }));
      
      return fields;
    }
    
    // Fallback for tables not defined in DB_SCHEMAS
    console.warn(`No schema definition found for table: ${tableName}`);
    return [
      { name: 'id', type: 'string', required: true, isPrimaryKey: true },
      { name: 'created_at', type: 'timestamp', required: false, isPrimaryKey: false }
    ];
  };

  // Function to create a table controller with all CRUD operations
  const createTableController = (tableName: string): DbTable => {
    const supabase = createClient();
    
    // Create a new table controller object
    const tableController: DbTable = {
      name: tableName,
      data: [],
      fields: [],
      loading: true,
      error: null,
      
      // Get all records
      get: function() {
        return this.data;
      },
      
      // Get a record by ID
      getById: function(id: string) {
        return this.data.find(item => item.id === id);
      },
      
      // Add a new record
      add: async function(record: any) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .insert(record)
            .select()
            .single();
          
          if (error) throw error;
          
          // Update local data if successful
          if (data) {
            setTablesObj(prev => {
              const updatedTable = { ...prev[tableName] };
              updatedTable.data = [...updatedTable.data, data];
              return { ...prev, [tableName]: updatedTable };
            });
          }
          
          return { data, error: null };
        } catch (err: any) {
          console.error(`Error adding to ${tableName}:`, err);
          return { data: null, error: err.message };
        }
      },
      
      // Update a record
      update: async function(id: string, updates: any) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          // Update local data if successful
          if (data) {
            setTablesObj(prev => {
              const updatedTable = { ...prev[tableName] };
              updatedTable.data = updatedTable.data.map(item => 
                item.id === id ? { ...item, ...data } : item
              );
              return { ...prev, [tableName]: updatedTable };
            });
          }
          
          return { success: true, error: null };
        } catch (err: any) {
          console.error(`Error updating in ${tableName}:`, err);
          return { success: false, error: err.message };
        }
      },
      
      // Delete a record
      destroy: async function(id: string) {
        try {
          const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          // Update local data if successful
          setTablesObj(prev => {
            const updatedTable = { ...prev[tableName] };
            updatedTable.data = updatedTable.data.filter(item => item.id !== id);
            return { ...prev, [tableName]: updatedTable };
          });
          
          return { success: true, error: null };
        } catch (err: any) {
          console.error(`Error deleting from ${tableName}:`, err);
          return { success: false, error: err.message };
        }
      },
      
      // Refresh the data
      refresh: async function() {
        await fetchAndUpdateTableData(tableName);
        return;
      },
      
      // Run a custom query against this table
      query: async function(queryFn) {
        try {
          const baseQuery = supabase.from(tableName);
          const result = await queryFn(baseQuery);
          return result;
        } catch (err: any) {
          console.error(`Error in custom query on ${tableName}:`, err);
          return { data: null, error: err };
        }
      }
    };
    
    return tableController;
  };

  // Function to fetch data from a specific table and update the controller
  const fetchAndUpdateTableData = async (tableName: string) => {
    const supabase = createClient();
    
    // Mark table as loading
    setTablesObj(prev => {
      const updatedTable = prev[tableName] ? { ...prev[tableName] } : createTableController(tableName);
      updatedTable.loading = true;
      updatedTable.error = null;
      return { ...prev, [tableName]: updatedTable };
    });
    
    try {
      // Fetch data from the table
      const { data, error } = await supabase.from(tableName).select('*');
      
      // Fetch table schema
      const fields = await fetchTableSchema(tableName);
      
      // Update state with the results
      setTablesObj(prev => {
        const updatedTable = { ...prev[tableName] };
        updatedTable.data = data || [];
        updatedTable.fields = fields;
        updatedTable.loading = false;
        updatedTable.error = error ? error.message : null;
        return { ...prev, [tableName]: updatedTable };
      });
    } catch (err: any) {
      // Handle errors
      setTablesObj(prev => {
        const updatedTable = { ...prev[tableName] };
        updatedTable.loading = false;
        updatedTable.error = err.message;
        return { ...prev, [tableName]: updatedTable };
      });
    }
  };

  // Initialize tables
  useEffect(() => {
    // Get table names from the DB_SCHEMAS array
    const tableNames = DB_SCHEMAS.map(schema => schema.tableName);
    
    // Create controllers for all tables
    const initialTables: { [key: string]: DbTable } = {};
    tableNames.forEach(name => {
      initialTables[name] = createTableController(name);
    });
    
    setTablesObj(initialTables);
    
    // Fetch data for all tables
    tableNames.forEach(name => {
      fetchAndUpdateTableData(name);
    });
  }, []);

  window.tt = tablesObj; // For debugging purposes
  return (
    <DbContext.Provider value={{ tables: tablesObj }}>
      {children}
    </DbContext.Provider>
  );
}