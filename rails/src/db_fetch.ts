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
    // Check if the table exists in the allowed tables list
    if (!ALL_TABLE_NAMES.includes(tableName as any)) {
      throw new Error(`Table "${tableName}" is not in the allowed tables list`);
    }

    console.log(`📥 DB_FETCH: Fetching raw data from table: ${tableName}`);
    // Fetch actual data from the table
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

  // Default empty API implementation
  const defaultApi = {
    get: async () => Promise.resolve([]),
    getId: async () => Promise.resolve(null),
    put: async () => Promise.resolve(null),
    updateId: async () => Promise.resolve(null),
    deleteId: async () => Promise.resolve(null),
  };

  // Process each table
  for (const tableName of tablesToFetch) {
    console.log(`🔄 DB_FETCH: Processing table: ${tableName}`);
    try {
      // Fetch data for this table
      const tableData = await fetchTableDataRaw(client, tableName);

      // Get dictionary information for this table if available
      const tableDictInfo = dbTableDictionary[tableName];

      // Create the table entity using dictionary data if available
      tables[tableName] = {
        name: tableName,
        fields:
          tableDictInfo?.fields ||
          (tableData && tableData.length > 0
            ? Object.keys(tableData[0]).map((key) => ({
                name: key,
                type: typeof tableData[0][key],
                required: key === "id",
                isPrimaryKey: key === "id",
              }))
            : [
                {
                  name: "id",
                  type: "number",
                  required: true,
                  isPrimaryKey: true,
                },
              ]),
        data: tableData || [],
        api: defaultApi,
        relationship: tableDictInfo?.relationship || [],
        desc: tableDictInfo?.desc || `Table for ${tableName}`,
      };
      console.log(`✅ DB_FETCH: Successfully initialized table: ${tableName}`);
    } catch (error) {
      console.error(`❌ DB_FETCH: Error initializing table ${tableName}:`, error);

      // Add a placeholder entry even if there was an error
      // Use dictionary information if available
      const tableDictInfo = dbTableDictionary[tableName];

      tables[tableName] = {
        name: tableName,
        fields: tableDictInfo?.fields,
        data: [],
        api: defaultApi,
        relationship: tableDictInfo?.relationship || [],
        desc: tableDictInfo?.desc || `Error loading table ${tableName}`,
      };
    }
  }

  console.log(`✅ DB_FETCH: Completed initialization of ${Object.keys(tables).length} tables`);
  return tables;
};
