import { SupabaseClient } from "@supabase/supabase-js";
import { ALL_TABLE_NAMES } from "@/rails/routes";
import { TableEntity, TableField } from "@/rails/types";
import { dbTableDictionary } from "@/rails/typesDictionary";

/**
 * Fetches data from a specific table and returns it in raw form
 * @param client The Supabase client instance
 * @param tableName The name of the table to fetch from
 * @returns The fetched data or null if there was an error
 */
const fetchTableDataRaw = async (
  client: SupabaseClient,
  tableName: string
): Promise<any> => {

  try {
    if (!ALL_TABLE_NAMES.includes(tableName as any)) {
      throw new Error(`Table "${tableName}" is not in the allowed tables list`);
    }

    console.log(`📥 DB_FETCH: Fetching raw data from table: ${tableName}`);

    const { data, error } = await client.from(tableName).select("*");

    if (error) {
      throw error;
    }

    console.log(`✅ DB_FETCH: Successfully fetched ${data?.length || 0} rows from ${tableName}`);
    return data || [];
  } catch (error) {
    console.error(`❌ DB_FETCH: Error fetching data from ${tableName}:`, error);
    return null;
  }
};

/**
 * Fetches data from tables and initializes them as proper TableEntity objects
 * @param client The Supabase client instance
 * @param tableNames The names of the tables to fetch
 * @returns A record of TableEntity objects by table name
 */
export const fetchTablesDataFromDb = async (
  client: SupabaseClient,
  tableNames: string[]
): Promise<Record<string, TableEntity>> => {
  console.log(`🔄 DB_FETCH: Starting fetch for tables: ${tableNames.join(", ")}`);
  return await initializeTables(client, tableNames);
};

/**
 * Initialize table entities for the provided table names
 * @param client The Supabase client instance
 * @param tablesToFetch Array of table names to initialize
 * @returns Object mapping table names to TableEntity objects
 */
export const initializeTables = async (
  client: SupabaseClient,
  tablesToFetch: string[]
): Promise<Record<string, TableEntity>> => {
  console.log(`📚 DB_FETCH: Initializing ${tablesToFetch.length} tables`);
  const tables: Record<string, TableEntity> = {};

  // Create table-specific API implementation
  const createTableApi = (tableName: string) => ({
    get: async () => {
      const { data, error } = await client.from(tableName).select();
      if (error) throw error;
      return data;
    },
    getId: async (id: string | number) => {
      const { data, error } = await client
        .from(tableName)
        .select()
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    put: async (data: any) => {
      const { data: result, error } = await client
        .from(tableName)
        .insert(data)
        .select();
      if (error) throw error;
      return result;
    },
    updateId: async (id: string | number, data: any) => {
      const { data: result, error } = await client
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select();
      if (error) throw error;
      return result;
    },
    deleteId: async (id: string | number) => {
      const { error } = await client
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    },
  });

  // Process each table
  for (const tableName of tablesToFetch) {
    console.log(`🔄 DB_FETCH: Processing table: ${tableName}`);
    const tableDictInfo = dbTableDictionary[tableName];
    let tableData = null;

    try {
      tableData = await fetchTableDataRaw(client, tableName);
    } catch (error) {
      console.error(`❌ DB_FETCH: Error fetching data for table ${tableName}:`, error);
    }

    // Create the table entity using available data
    tables[tableName] = {
      name: tableName,
      fields: tableDictInfo?.fields || 
        (tableData && tableData.length > 0
          ? Object.keys(tableData[0]).map((key) => ({
              name: key,
              type: typeof tableData[0][key],
              required: false,
              isPrimaryKey: false,
            }))
          : []),
      data: tableData || [],
      api: createTableApi(tableName),
      relationship: tableDictInfo?.relationship || [],
      desc: tableDictInfo?.desc || `Table for ${tableName}`,
    };

    console.log(`✅ DB_FETCH: Successfully initialized table: ${tableName}`);
  }

  console.log(`✅ DB_FETCH: Completed initialization of ${Object.keys(tables).length} tables`);
  return tables;
};
