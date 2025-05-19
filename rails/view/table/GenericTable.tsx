import { TableField } from "@/rails/types";

export interface GenericTableProps {
    fields: TableField[];
    data: any[];
}

export function GenericTable({ table }: { table: GenericTableProps }) {
    // Early return if table is undefined
    if (!table || !table.fields || !table.data) {
        return <div>No table data available</div>;
    }

    const TableHeader = () => (
        <thead>
            <tr>
                {table.fields.map((field, index) => (
                    <th key={index}>{field.name}</th>
                ))}
            </tr>
        </thead>
    );

    const TableBody = () => (
        <tbody>
            {table.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {table.fields.map((field, colIndex) => (
                        <td key={colIndex}>{row[field.name]}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    );

    return (
        <table>
            <TableHeader />
            <TableBody />
        </table>
    );
}