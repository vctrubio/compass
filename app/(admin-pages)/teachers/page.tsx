"use client";
import React from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";
import { createTableData } from "@/rails/src/tableDataAdapter";
import { Teacher4AdminForm } from "@/rails/view/form/teacher4AdminForm";
import { Teacher } from "@/rails/model/teacher";

export default function TeachersPage() {
  const { tables } = useAdminContext();
  const teachersTable = tables.teachers;

  if (!teachersTable) {
    return <div>No table found</div>;
  }

  return (
    <ControllerContent
      title="Teachers"
      tableName="teachers"
      tableData={teachersTable}
      searchFields={["name", "email", "phone", "languages"]}
      addForm={Teacher4AdminForm}
    />
  );
}