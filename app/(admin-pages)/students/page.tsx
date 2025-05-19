"use client";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";
import { dbTableDictionary } from "@/rails/typesDictionary";
import { Student4AdminForm } from "@/rails/view/form/student4AdminForm";
import { Student } from "@/rails/model/student";

export default function StudentsPage() {
  const { tables } = useAdminContext();
  const studentsTable = tables.students;

  if (!studentsTable) {
    return <div>No table found</div>;
  }

  return (
    <ControllerContent
      title="Students"
      tableName="students"
      tableData={studentsTable}
      searchFields={["name", "email", "phone", "languages"]}
      addForm={Student4AdminForm}
    />
  );
}