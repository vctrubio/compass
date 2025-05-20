'use client'
import React from 'react';
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from '@/rails/controller/ControllerContent';
import { Booking4AdminForm } from '@/rails/view/form/booking4AdminForm';
import { bookingFieldMappings } from '@/rails/src/mapping';

export default function BookingsPage() {
  const { tables } = useAdminContext();
  const bookingsTable = tables.bookings;
  
  if (!bookingsTable) {
    return <div>No table found</div>;
  }

  return (
    <ControllerContent
      title="Bookings"
      tableName="bookings"
      tableData={bookingsTable}
      searchFields={['student_id']}
      fieldMappings={bookingFieldMappings}
      // No need to pass allTables as GenericTable will use the context
      addForm={(props) => (
        <Booking4AdminForm
          {...props}
          // No need to pass students and packages explicitly now
          // The form will get them from the context
        />
      )}
    />
  );
}