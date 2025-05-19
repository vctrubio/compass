"use client";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from "@/rails/controller/ControllerContent";
import { dbTableDictionary } from "@/rails/typesDictionary";
import { Student4AdminForm } from "@/rails/view/form/student4AdminForm";
import { Student } from "@/rails/model/student";

export default function StudentsPage() {
  const { tables } = useAdminContext();
  const studentsTable = tables.students;

  const handleStudentSubmit = async (data: Student): Promise<boolean> => {
    try {
      console.log("Hello world, this is a submit button test with form data:", data);
      const result = await studentsTable.api?.put(data);
      console.log("Result of put:", result);
      return true;
    } catch (error) {
      console.error("Error submitting student:", error);
      return false;
    }
  };

  if (!studentsTable) {
    return <div>No table found</div>;
  }

  window.students = studentsTable;

  return (
    <ControllerContent
      title="Students"
      tableName="students"
      tableData={studentsTable}
      searchFields={["name", "email", "first_name", "last_name"]}
      addForm={(props) => <Student4AdminForm {...props} onSubmit={handleStudentSubmit} />}
    />
  );
}