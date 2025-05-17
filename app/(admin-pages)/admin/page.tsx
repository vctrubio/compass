'use client'
import React, { useState } from 'react';
import { useDb } from '@/utils/context/db-context';
import { RecordHeader } from '@/components/admin/RecordHeader';
import { DbUsageExample } from '@/components/admin/DbUsageExample';

export default function AdminPage() {
  const { tables } = useDb();
  const testTable = tables.test;

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