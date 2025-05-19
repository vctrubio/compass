"use client";
import React from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";
import { dbTableDictionary } from "@/rails/typesDictionary";

export default function SessionsPage() {
  const { tables } = useAdminContext();
  // Note: If 'sessions' isn't in your DB_TABLES, we should create this schema
  const sessionsTable = tables.sessions;

  // Handle cases where the table doesn't exist
  if (!sessionsTable) {
    return <div>No table found</div>;
  }

  // Convert the sessionsTable to the format expected by ControllerContent
  const tableData = {
    name: sessionsTable.name,
    fields: sessionsTable.fields,
    data: sessionsTable.data,
    // Use dictionary data for filter and sort options, or defaults if not in dictionary
    filterBy: dbTableDictionary.sessions?.filterBy || [],
    sortBy: dbTableDictionary.sessions?.sortBy || [],
    // These are required by the TableEntity type
    relationship: dbTableDictionary.sessions?.relationship || [],
    desc: dbTableDictionary.sessions?.desc || "Sessions table",
    api: {
      get: async () => sessionsTable.data || [],
      getId: async (id: string | number) => {
        const idStr = String(id);
        return (
          sessionsTable.data?.find((item) => String(item.id) === idStr) || null
        );
      },
      put: async (data: any) => ({ data, error: null }),
      updateId: async (id: string | number, data: any) => ({
        success: true,
        error: null,
      }),
      deleteId: async (id: string | number) => ({
        success: true,
        error: null,
      }),
    },
  };

  return (
    <ControllerContent
      title="Sessions"
      tableName="sessions"
      tableData={tableData}
      searchFields={["startTime"]}
    />
  );
}