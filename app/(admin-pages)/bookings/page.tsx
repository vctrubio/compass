'use client'
import React from 'react';
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from '@/rails/controller/ControllerContent';
import { dbTableDictionary } from '@/rails/typesDictionary';

export default function BookingsPage() {
  const { tables } = useAdminContext();
  const bookingsTable = tables.bookings;
  
  // Handle cases where the table doesn't exist
  if (!bookingsTable) {
    return <div>No table found</div>;
  }
  
  // Convert the bookingsTable to the format expected by ControllerContent
  const tableData = {
    name: bookingsTable.name,
    fields: bookingsTable.fields,
    data: bookingsTable.data,
    // Use dictionary data for filter and sort options, or defaults if not in dictionary
    filterBy: dbTableDictionary.bookings?.filterBy || [],
    sortBy: dbTableDictionary.bookings?.sortBy || [],
    // These are required by the TableEntity type
    relationship: dbTableDictionary.bookings?.relationship || [],
    desc: dbTableDictionary.bookings?.desc || 'Bookings table',
    api: {
      get: async () => bookingsTable.data || [],
      getId: async (id: string | number) => {
        const idStr = String(id);
        return bookingsTable.data?.find(item => String(item.id) === idStr) || null;
      },
      put: async (data: any) => ({ data, error: null }),
      updateId: async (id: string | number, data: any) => ({ success: true, error: null }),
      deleteId: async (id: string | number) => ({ success: true, error: null })
    }
  };
  
  return (
    <ControllerContent 
      title="Bookings"
      tableName="bookings"
      tableData={tableData}
      searchFields={['startDate']}
    />
  );
}