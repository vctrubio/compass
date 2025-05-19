'use client'
import React, { useState } from 'react';
import { useDb } from '@/utils/context/db-context';
import { useAdminContext } from '@/rails/provider/admin-context-provider'
import { RecordHeader } from '@/components/admin/RecordHeader';
import { DbUsageExample } from '@/components/admin/DbUsageExample';

export default function AdminPage() {
  const { listTables} = useAdminContext();

  const testTable = listTables;

  if (!testTable) {
    return <div>undefined...</div>;
  }

  return <pre>{JSON.stringify(testTable, null, 2)}</pre>;

  return (
    <div className='flex flex-col gap-4'>
      <RecordHeader
        title="Admin Dashboard"
        table={testTable}
      />

      <DbUsageExample />
    </div>
  );
}