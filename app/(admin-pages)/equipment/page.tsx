"use client";
import React from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";

export default function EquipmentsPage() {
  const { tables } = useAdminContext();
  const equipmentsTable = tables.equipment;

  if (!equipmentsTable) {
    return <div>No table found</div>;
  }

  return (
    <ControllerContent
      title="Equipment"
      tableName="equipment"
      tableData={equipmentsTable}
      searchFields={["type", "model", "brand"]}
      // addForm={equipmentSpecificForm} // Uncomment and use if you have a form
    />
  );
}