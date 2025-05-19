import { TableEntity } from "@/rails/types";
import { dbTableDictionary } from "@/rails/typesDictionary";

/**
 * Helper function to convert an admin table to TableEntity format
 * required by the ControllerContent component
 */
export function createTableData(tableName: string, adminTable: any): TableEntity | null {
  if (!adminTable) {
    return null;
  }
  
  // Use dictionary or defaults for filter and sort options
  const tableInfo = dbTableDictionary[tableName];
  
  const tableData: TableEntity = {
    name: adminTable.name,
    fields: adminTable.fields,
    data: adminTable.data,
    // Use dictionary data or defaults
    filterBy: adminTable.filterBy || tableInfo?.filterBy || [],
    sortBy: adminTable.sortBy || tableInfo?.sortBy || [],
    relationship: adminTable.relationship || tableInfo?.relationship || [],
    desc: adminTable.desc || tableInfo?.desc || `${tableName} table`,
    api: adminTable.api || {
      // Fallback if the API is not provided (should not happen in production)
      get: async () => adminTable.data || [],
      getId: async (id: string | number) => {
        const idStr = String(id);
        return adminTable.data?.find((item: any) => String(item.id) === idStr) || null;
      },
      put: async (data: any) => {
        console.warn(`Mock API used for ${tableName}.put() - no actual database operation performed`);
        return { data, error: null };
      },
      updateId: async (id: string | number, data: any) => {
        console.warn(`Mock API used for ${tableName}.updateId() - no actual database operation performed`);
        return { success: true, error: null };
      },
      deleteId: async (id: string | number) => {
        console.warn(`Mock API used for ${tableName}.deleteId() - no actual database operation performed`);
        return { success: true, error: null };
      }
    }
  };
  
  return tableData;
}

