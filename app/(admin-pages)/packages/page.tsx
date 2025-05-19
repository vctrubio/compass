'use client'
import React from 'react';
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from '@/rails/controller/ControllerContent';
import { dbTableDictionary } from '@/rails/typesDictionary';

export default function PackagesPage() {
  const { tables } = useAdminContext();
  const packagesTable = tables.packages;
  
  // Handle cases where the table doesn't exist
  if (!packagesTable) {
    return <div>No table found</div>;
  }
  
  // Convert the packagesTable to the format expected by ControllerContent
  const tableData = {
    name: packagesTable.name,
    fields: packagesTable.fields,
    data: packagesTable.data,
    // Use dictionary data for filter and sort options, or defaults if not in dictionary
    filterBy: dbTableDictionary.packages?.filterBy || [],
    sortBy: dbTableDictionary.packages?.sortBy || [],
    // These are required by the TableEntity type
    relationship: dbTableDictionary.packages?.relationship || [],
    desc: dbTableDictionary.packages?.desc || 'Packages table',
    api: {
      get: async () => packagesTable.data || [],
      getId: async (id: string | number) => {
        const idStr = String(id);
        return packagesTable.data?.find(item => String(item.id) === idStr) || null;
      },
      put: async (data: any) => ({ data, error: null }),
      updateId: async (id: string | number, data: any) => ({ success: true, error: null }),
      deleteId: async (id: string | number) => ({ success: true, error: null })
    }
  };
  
  return (
    <ControllerContent 
      title="Packages"
      tableName="packages"
      tableData={tableData}
      searchFields={['description']}
    />
  );
}