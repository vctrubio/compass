"use client";
import React from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";
import { dbTableDictionary } from "@/rails/typesDictionary";

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
      searchFields={["teacherId = teacher Name"]}
    // addForm={lessonSpecificForm} // Uncomment and use if you have a form
    />
  );
}
