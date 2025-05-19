import { SupabaseClient } from "@supabase/supabase-js";
import { ALL_TABLE_NAMES } from "@/rails/routes";

/**
 * Fetches data from a specific table
 * @param client The Supabase client instance
 * @param tableName The name of the table to fetch from
 * @returns The fetched data or null if there was an error
 */
export const fetchTableDataFromDb = async (
  client: SupabaseClient,
  tableName: string
): Promise<any> => {
  try {
    // Check if the table exists in the allowed tables list
    if (!ALL_TABLE_NAMES.includes(tableName as any)) {
      throw new Error(`Table "${tableName}" is not in the allowed tables list`);
    }

    console.log(`Fetching data from table: ${tableName}`);
    
    // For now, just return 1 as specified
    return 1;
    
    // In a real implementation, you would do something like:
    // const { data, error } = await client.from(tableName).select('*');
    // if (error) throw error;
    // return data;
  } catch (error) {
    console.error(`Unexpected error fetching data from ${tableName}:`, error);
    return null;
  }
};
