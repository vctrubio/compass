"use client";
import React from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";
import { createTableData, getDefaultSearchFields } from "@/rails/src/tableDataAdapter";

export default function TeachersPage() {
  const { tables } = useAdminContext();
  const teachersTable = tables.teachers;

  // Handle cases where the table doesn't exist
  if (!teachersTable) {
    return <div>No table found</div>;
  }

  // Convert the teachersTable to the format expected by ControllerContent
  const tableData = createTableData("teachers", teachersTable);

  if (!tableData) {
    return <div>Error processing table data</div>;
  }

  // Get appropriate search fields for this table
  const searchFields = getDefaultSearchFields(teachersTable.fields);

  return (
    <ControllerContent
      title="Teachers"
      tableName="teachers"
      tableData={tableData}
      searchFields={searchFields}
    />
  );
}