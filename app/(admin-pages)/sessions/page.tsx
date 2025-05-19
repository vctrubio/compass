"use client";
import React from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";

export default function SessionsPage() {
  const { tables } = useAdminContext();
  const sessionsTable = tables.sessions;

  if (!sessionsTable) {
    return <div>No table found</div>;
  }

  return (
    <ControllerContent
      title="Sessions"
      tableName="sessions"
      tableData={sessionsTable} // Use the table data directly from context
      searchFields={["startTime"]} // Or other relevant fields for sessions
      // addForm={SessionForm} // If you have a specific form for adding sessions
    />
  );
}
