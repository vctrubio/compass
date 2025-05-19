"use client";
import React from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";
import { dbTableDictionary } from "@/rails/typesDictionary";

export default function LessonsPage() {
  const { tables } = useAdminContext();
  const lessonsTable = tables.lessons;

  // Handle cases where the table doesn't exist
  if (!lessonsTable) {
    return <div>No table found</div>;
  }

  // Convert the lessonsTable to the format expected by ControllerContent
  const tableData = {
    name: lessonsTable.name,
    fields: lessonsTable.fields,
    data: lessonsTable.data,
    // Use dictionary data for filter and sort options, or defaults if not in dictionary
    filterBy: dbTableDictionary.lessons?.filterBy || [],
    sortBy: dbTableDictionary.lessons?.sortBy || [],
    // These are required by the TableEntity type
    relationship: dbTableDictionary.lessons?.relationship || [],
    desc: dbTableDictionary.lessons?.desc || "Lessons table",
    api: {
      get: async () => lessonsTable.data || [],
      getId: async (id: string | number) => {
        const idStr = String(id);
        return (
          lessonsTable.data?.find((item) => String(item.id) === idStr) || null
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
      title="Lessons"
      tableName="lessons"
      tableData={tableData}
      searchFields={["status"]}
    />
  );
}