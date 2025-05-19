'use client'
import React from 'react';
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from '@/rails/controller/ControllerContent';

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
      searchFields={['studentId']}
    />
  );
}