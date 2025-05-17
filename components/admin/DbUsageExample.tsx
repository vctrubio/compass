'use client'

import React from 'react';

export function DbUsageExample() {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">DB Controller Usage Examples</h2>
      <div className="bg-muted/10 p-4 rounded-lg text-sm font-mono overflow-x-auto">
        <pre>{`// Access controller for a specific table
const { tables } = useDb();
const testTable = tables.test;

// Get all records
const allRecords = testTable.get();

// Get a record by ID
const record = testTable.getById('some-id');

// Add a new record
const { data, error } = await testTable.add({ name: 'New Item', value: '123' });

// Update a record
const { success, error } = await testTable.update('record-id', { name: 'Updated Name' });

// Delete a record
const { success, error } = await testTable.destroy('record-id');

// Refresh data from database
await testTable.refresh();

// Run a custom query
const result = await testTable.query(query => 
  query.select('id, name').eq('value', '123').order('name')
);

// Access table metadata
const fieldNames = testTable.fields.map(f => f.name);`}</pre>
      </div>
    </div>
  );
}