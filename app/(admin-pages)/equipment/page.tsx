"use client";
import React from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";
import { dbTableDictionary } from "@/rails/typesDictionary";

export default function EquipmentsPage() {
  const { tables } = useAdminContext();
  const equipmentsTable = tables.equipment; //to change to equipments

  // Handle cases where the table doesn't exist
  if (!equipmentsTable) {
    return <div>No table found</div>;
  }

  // Convert the equipmentsTable to the format expected by ControllerContent
  const tableData = {
    name: equipmentsTable.name,
    fields: equipmentsTable.fields,
    data: equipmentsTable.data,
    // Use dictionary data for filter and sort options, or defaults if not in dictionary
    filterBy: dbTableDictionary.equipment?.filterBy || [],
    sortBy: dbTableDictionary.equipment?.sortBy || [],
    // These are required by the TableEntity type
    relationship: dbTableDictionary.equipment?.relationship || [],
    desc: dbTableDictionary.equipment?.desc || "Equipment table",
    api: {
      get: async () => equipmentsTable.data || [],
      getId: async (id: string | number) => {
        const idStr = String(id);
        return (
          equipmentsTable.data?.find((item) => String(item.id) === idStr) || null
        );
      },
      put: async (data: any) => ({ data, error: null }),
      updateId: async (id: string | number, data: any) => ({
        success: true,
        error: null,
      }),
      deleteId: async (id: string | number) => ({ success: true, error: null }),
    },
  };

  return (
    <ControllerContent
      title="Equipment"
      tableName="equipment"
      tableData={tableData}
      searchFields={["type", "model"]}
    />
  );
}