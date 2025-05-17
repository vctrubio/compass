'use client'
import React from 'react';
import { useDb } from '@/utils/context/db-context';
import { RecordHeader } from '@/components/admin/RecordHeader';
import { AlertTriangle, Database } from 'lucide-react';

export default function SessionsPage() {
  const { tables } = useDb();
  // Note: If 'sessions' isn't in your DB_TABLES, we should create this schema
  const sessionsTable = tables.sessions;
  
  // Handle cases where the table doesn't exist or there's an error
  if (!sessionsTable) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Sessions Management</h1>
        <div className="p-4 border rounded-lg bg-amber-50 text-amber-800 flex items-start gap-3">
          <Database className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Table not found</p>
            <p className="mt-1">The sessions table has not been defined in the database schema or couldn't be accessed.</p>
            <p className="mt-1">You need to add this table to your DB_TABLES in db-zod.ts.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (sessionsTable.error) {
    return (
      <div className="p-6 border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Sessions Management</h1>
        <div className="p-4 border rounded-lg bg-red-50 text-red-800 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Error connecting to database</p>
            <p className="mt-1">{sessionsTable.error}</p>
            <p className="mt-1">Please check your database connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className='flex flex-col gap-4'>
      <RecordHeader 
        title="Sessions Management" 
        table={sessionsTable} 
      />
    </div>
  );
}