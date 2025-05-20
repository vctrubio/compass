'use client'
import React from 'react';
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from '@/rails/controller/ControllerContent';
import { Booking4AdminForm } from '@/rails/view/form/booking4AdminForm';

export default function BookingsPage() {
  const { tables } = useAdminContext();
  const bookingsTable = tables.bookings;
  const students = tables.students?.data || [];
  const packages = tables.packages?.data || [];

  if (!bookingsTable) {
    return <div>No table found</div>;
  }

  return (
    <ControllerContent
      title="Bookings"
      tableName="bookings"
      tableData={bookingsTable}
      searchFields={['studentId']}
      addForm={(props) => (
        <Booking4AdminForm
          {...props}
          students={students}
          packages={packages}
        />
      )}
    />
  );
}