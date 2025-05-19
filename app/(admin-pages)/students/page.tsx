"use client";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";
import { dbTableDictionary } from "@/rails/typesDictionary";

export default function StudentsPage() {
  const { tables } = useAdminContext();
  const studentsTable = tables.students;

  if (!studentsTable) {
    return <div>No table found</div>;
  }

  // Convert the studentsTable to the format expected by ControllerContent
  const tableData = {
    name: studentsTable.name,
    fields: studentsTable.fields,
    data: studentsTable.data,
    filterBy: studentsTable.filterBy || dbTableDictionary.students?.filterBy || [],
    sortBy: studentsTable.sortBy || dbTableDictionary.students?.sortBy || [],
    relationship: studentsTable.relationship || dbTableDictionary.students?.relationship || [],
    desc: studentsTable.desc || dbTableDictionary.students?.desc || "Students table",
    api: {
      get: async () => studentsTable.data || [],
      getId: async (id: string | number) => {
        const idStr = String(id);
        return studentsTable.data?.find((item) => String(item.id) === idStr) || null;
      },
      put: async (data: any) => ({ data, error: null }),
      updateId: async (id: string | number, data: any) => ({ success: true, error: null }),
      deleteId: async (id: string | number) => ({ success: true, error: null }),
    },
  };

  return (
    <ControllerContent
      title="Students"
      tableName="students"
      tableData={tableData}
      searchFields={["name", "email", "first_name", "last_name"]}
    />
  );
}