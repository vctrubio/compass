"use client";
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StudentIdView } from "@/rails/view/id/StudentIdView";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDetailPage() {
  const { tables, fetchTables } = useAdminContext();
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<any>(null);

  if (!params.table || !params.id) 
    return <div>No table or id</div>;
  const tableName = params.table as string;
  const id = params.id as string;
  const table = tables[tableName];

  useEffect(() => {
    const initializeAndFetch = async () => {
      try {
        // If table is not initialized, fetch it first
        if (!table?.api?.getId) {
          console.log(`Table ${tableName} not initialized, fetching...`);
          await fetchTables([tableName]);
        }

        // Now try to get the item
        const currentTable = tables[tableName];
        if (!currentTable?.api?.getId) {
          throw new Error("Table API not properly configured");
        }

        const data = await currentTable.api.getId(id);
        setItem(data);
        setEditedItem(data);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch item");
      } finally {
        setLoading(false);
      }
    };

    initializeAndFetch();
  }, [table, id, tableName, fetchTables, tables]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!table?.api?.updateId) {
        throw new Error("Table API not properly configured");
      }
      await table.api.updateId(id, editedItem);
      setItem(editedItem);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Item not found</div>;

  // Use the appropriate view component based on the table name


  // Default view for other tables
  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {tableName.charAt(0).toUpperCase() + tableName.slice(1)} Details
        </h1>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Fields Section */}
      <div className="border rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Fields</h2>
        <div className="space-y-4">
          {Object.entries(item).map(([key, value]) => (
            <div key={key} className="flex items-start gap-4">
              <div className="w-1/3">
                <span className="font-medium">{key}</span>
              </div>
              <div className="w-2/3">
                {isEditing ? (
                  <input
                    type="text"
                    value={String(editedItem[key] || "")}
                    onChange={(e) => 
                      setEditedItem(prev => ({
                        ...prev,
                        [key]: e.target.value
                      }))
                    }
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <p>
                    {Array.isArray(value)
                      ? value.join(", ")
                      : String(value || "-")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relationships Section */}
      <div className="border rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Relationships</h2>
        <div className="text-muted-foreground">
          No relationships defined
        </div>
      </div>
    </div>
  );
} 