import { TableField } from "@/rails/types";
import { cn } from "@/lib/twMerge";
import { GenericRow } from "./GenericRow";

export interface GenericTableProps {
    fields: TableField[];
    data: any[];
}

export function GenericTable({ table }: { table: GenericTableProps }) {
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

    const TableHeader = () => (
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
    );

    const TableBody = () => (
        <tbody>
            {table.data.map((row, rowIndex) => (
                <GenericRow
                    key={rowIndex}
                    row={row}
                    fields={table.fields}
                    rowIndex={rowIndex}
                />
            ))}
        </tbody>
    );

    return (
        <div className="w-full overflow-auto">
            <table className="w-full table-auto border-collapse border rounded-md">
                <TableHeader />
                <TableBody />
            </table>
        </div>
    );
}