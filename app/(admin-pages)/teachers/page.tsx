'use client'
import React from 'react';
import { useDb } from '@/utils/context/db-context';
import { RecordHeader } from '@/components/admin/RecordHeader';
import { AlertTriangle, Database } from 'lucide-react';

export default function TeachersPage() {
  const { tables } = useDb();
  const teachersTable = tables.test;
  
  console.log('Teachers Table:', tables.test);
  // Handle cases where the table doesn't exist or there's an error
  if (!teachersTable) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Teachers Management</h1>
        <div className="p-4 border rounded-lg bg-amber-50 text-amber-800 flex items-start gap-3">
          <Database className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Table not found</p>
            <p className="mt-1">The teachers table has not been defined in the database schema or couldn't be accessed.</p>
            <p className="mt-1">You need to add this table to your DB_TABLES in db-zod.ts.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (teachersTable.error) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Teachers Management</h1>
        <div className="p-4 border rounded-lg bg-red-50 text-red-800 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Error connecting to database</p>
            <p className="mt-1">{teachersTable.error}</p>
            <p className="mt-1">Please check your database connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className='flex flex-col gap-4'>
      <RecordHeader 
        title="Teachers Management" 
        table={teachersTable} 
      />
    </div>
  );
}