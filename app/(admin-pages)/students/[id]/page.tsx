"use client";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StudentIdView } from "@/rails/view/id/StudentIdView";

export default function StudentDetailPage() {
  const { tables } = useAdminContext();
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;
  const table = tables.students;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!table?.api?.getId) {
          throw new Error("Table API not properly configured");
        }
        const data = await table.api.getId(id);
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [table, id]);

  const handleSave = async (updatedStudent: any) => {
    try {
      if (!table?.api?.updateId) {
        throw new Error("Table API not properly configured");
      }
      await table.api.updateId(id, updatedStudent);
      setItem(updatedStudent);
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Item not found</div>;

  return <StudentIdView student={item} onSave={handleSave} />;
} 