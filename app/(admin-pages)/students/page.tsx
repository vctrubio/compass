'use client';
import { useState, useEffect } from "react";
import { useAdminContext } from "@/rails/provider/admin-context-provider"
import { GenericTable } from "@/rails/view/table/GenericTable";
import { GenericTableProps } from "@/rails/view/table/GenericTable";
import { TableActions } from "@/rails/view/table/TableActions";

export default function StudentsPage() {
  const { tables } = useAdminContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const fields = tables.students?.fields || [];

  // Initialize data when tables load
  useEffect(() => {
    if (tables.students?.data) {
      setAllData(tables.students.data);
      setFilteredData(tables.students.data);
    }
  }, [tables.students?.data]);

  // Filter data when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(allData);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = allData.filter(student => {
      // Search by name (assuming there's a name field, adjust if the field name is different)
      return (
        (student.name && student.name.toLowerCase().includes(searchTermLower)) ||
        (student.first_name && student.first_name.toLowerCase().includes(searchTermLower)) ||
        (student.last_name && student.last_name.toLowerCase().includes(searchTermLower))
      );
    });
    
    setFilteredData(filtered);
  }, [searchTerm, allData]);

  const tableProps: GenericTableProps = {
    fields: fields,
    data: filteredData
  };

  return (
    <div className="space-y-4">
      <TableActions
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        searchPlaceholder="Search by name..."
      />
      
      <GenericTable table={tableProps} />
    </div>
  );
}