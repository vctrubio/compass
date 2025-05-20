import { TableField } from "@/rails/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDate } from "@/rails/src/formatters";

interface GenericTableProps {
  table: {
    fields: TableField[];
    data: any[];
  };
}

export function GenericTable({ table }: GenericTableProps) {
  const pathname = usePathname();

  if (!table || !table.fields || !table.data) {
    return <div className="text-sm text-muted-foreground p-4 rounded-md bg-muted/10">No table data available</div>;
  }

  if (table.data.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-background">
        <p className="text-muted-foreground">No data to display</p>
      </div>
    );
  }

  console.log("Table data:", table.data);

  return (
    <div className="w-full overflow-auto">
      <table className="w-full table-auto border-collapse border rounded-md">
        <thead className="bg-muted/50">
          <tr>
            {table.fields.map((field, index) => (
              <th
                key={index}
                className="text-left font-medium text-muted-foreground p-3 text-sm"
              >
                {field.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {table.fields.map((field) => (
                <td
                  key={field.name}
                  className="p-3 text-sm"
                >
                  {field.name === "id" ? (
                    <Link
                      href={`${pathname}/${row[field.name]}`}
                      className="text-primary hover:text-primary/80"
                    >
                      {row[field.name]}
                    </Link>
                  ) : field.type === 'date' ? (
                    formatDate(row[field.name])
                  ) : (
                    Array.isArray(row[field.name])
                      ? row[field.name].join(", ")
                      : String(row[field.name])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}