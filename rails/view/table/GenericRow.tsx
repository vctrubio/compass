import React from 'react';
import { TableField } from "@/rails/types";

interface GenericRowProps {
    row: any;
    fields: TableField[];
    rowIndex: number;
}

export function GenericRow({ row, fields, rowIndex }: GenericRowProps) {
    return (
        <tr
            key={rowIndex}
        >
            {fields.map((field, colIndex) => (
                <td
                    key={colIndex}
                    className="text-left p-3 text-md"
                >
                    {row[field.name] !== null && row[field.name] !== undefined
                        ? row[field.name]
                        : <span className="text-muted-foreground italic text-xs">N/A</span>}
                </td>
            ))}
        </tr>
    );
}
