'use client';
import { useAdminContext } from "@/rails/provider/admin-context-provider"
import { GenericTable } from "@/rails/view/table/GenericTable";
import { GenericTableProps } from "@/rails/view/table/GenericTable"; // Import the type

export default function StudentsPage() {
    const { tables } = useAdminContext();

  const data = tables.students?.data || [];
  const fields = tables.students?.fields || [];

  const tableProps: GenericTableProps = {
    fields: fields,
    data: data
  };

  return (
    <div>
      <GenericTable table={tableProps} />
    </div>
  );
}