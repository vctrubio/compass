"use client";
import React from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";
import { Session4AdminForm } from "@/rails/view/form/session4AdminForm";
import { sessionFieldMappings } from "@/rails/src/mapping";

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
      tableData={sessionsTable}
      searchFields={["start_time", "duration"]}
      fieldMappings={sessionFieldMappings}
      addForm={(props) => (
        <Session4AdminForm
          {...props}
        />
      )}
    />
  );
}
