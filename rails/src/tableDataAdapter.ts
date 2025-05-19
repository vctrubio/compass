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
    api: {
      get: async () => adminTable.data || [],
      getId: async (id: string | number) => {
        const idStr = String(id);
        return adminTable.data?.find((item: any) => String(item.id) === idStr) || null;
      },
      put: async (data: any) => ({ data, error: null }),
      updateId: async (id: string | number, data: any) => ({ success: true, error: null }),
      deleteId: async (id: string | number) => ({ success: true, error: null })
    }
  };
  
  return tableData;
}

/**
 * Get appropriate search fields for a table based on its schema
 */
export function getDefaultSearchFields(fields: any[]): string[] {
  const searchableFields = fields.filter(field => 
    field.type === 'string' && 
    !field.isPrimaryKey &&
    ['name', 'title', 'description', 'email', 'phone', 'first_name', 'last_name'].includes(field.name)
  ).map(field => field.name);
  
  return searchableFields.length ? searchableFields : ['name'];
}
