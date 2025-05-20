"use client";
import React from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";
import { lessonFieldMappings } from "@/rails/src/mapping";
import { Lesson4AdminForm } from "@/rails/view/form/lesson4AdminForm";

export default function LessonsPage() {
  const { tables } = useAdminContext();
  const lessonsTable = tables.lessons;

  if (!lessonsTable) {
    return <div>No table found</div>;
  }
  
  return (
    <ControllerContent
      title="Lessons"
      tableName="lessons"
      tableData={lessonsTable}
      searchFields={["status", "teacher_id", "booking_id"]}
      fieldMappings={lessonFieldMappings}
      allTables={tables} // Pass all tables for relation mapping
      addForm={(props) => (
        <Lesson4AdminForm
          {...props}
          // The form will get data from context, but we can pass initial data if needed
        />
      )}
    />
  );
}
