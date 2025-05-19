"use client";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDetailPage() {
  const { tables } = useAdminContext();
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tableName = params.table as string;
  const id = params.id as string;
  const table = tables[tableName];

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {tableName.charAt(0).toUpperCase() + tableName.slice(1)} Details
      </h1>
      <div className="bg-white shadow rounded-lg p-6">
        {Object.entries(item).map(([key, value]) => (
          <div key={key} className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">{key}</h3>
            <p className="mt-1 text-lg">
              {Array.isArray(value) ? value.join(", ") : String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 