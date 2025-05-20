import React from 'react';
import { TableField } from "@/rails/types";
import { formatDate } from "@/rails/src/formatters";

interface GenericRowProps {
    row: any;
    fields: TableField[];
    rowIndex: number;
}

export function GenericRow({ row, fields, rowIndex }: GenericRowProps) {
    // Format cell value based on its type
    const formatCellValue = (value: any, field: TableField) => {
        // Handle null or undefined
        if (value === null || value === undefined) {
            return <span className="text-muted-foreground italic text-xs">N/A</span>;
        }
        
        // Handle date fields
        if (field.type === 'date') {
            return formatDate(value);
        }
        
        // Handle arrays (like languages)
        if (Array.isArray(value)) {
            return value.join(", ");
        }
        
        // Handle boolean values
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        
        // Return as is for other types
        return value;
    };

    return (
        <tr
            key={rowIndex}
        >
            {fields.map((field, colIndex) => (
                <td
                    key={colIndex}
                    className="text-left p-3 text-md"
                >
                    {formatCellValue(row[field.name], field)}
                </td>
            ))}
        </tr>
    );
}
