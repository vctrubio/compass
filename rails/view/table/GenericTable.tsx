import { TableEntity, TableField } from "@/rails/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { formatDate, formatCurrency, formatDuration, formatStatus, BOOKING_STATUS_MAP, LESSON_STATUS_MAP } from "@/rails/src/formatters";
import { FieldMapping, mapRelatedFields, mapRelatedFieldsAsync } from "@/rails/src/mapping";
import { useAdminContext } from "@/rails/provider/admin-context-provider";

interface GenericTableProps {
  table: {
    fields: TableField[];
    data: any[];
    name?: string;  // Table name used for applying default mappings
  };
  allTables?: Record<string, TableEntity>;  // All tables for resolving relations
  fieldMappings?: FieldMapping[];  // Custom field mappings to apply
  tableName?: string;  // Table name for status and formatting utilities
}

export function GenericTable({ table, allTables: propTables, fieldMappings: propMappings, tableName: propTableName }: GenericTableProps) {
  const pathname = usePathname();
  const { tables } = useAdminContext();
  const [asyncMappedValues, setAsyncMappedValues] = useState<Record<string, Record<string, string>>>({});
  
  // Use context tables if available, otherwise fall back to props
  const allTables = tables || propTables;
  
  // Get tableName and fieldMappings
  const tableName = propTableName || table?.name;
  let fieldMappings = propMappings;
  
  // Use a static mapping registry instead of dynamic imports (more compatible with Next.js)
  if (tableName && !fieldMappings) {
    // This could be expanded to include more mappings as they are created
    if (tableName === 'bookings' && allTables) {
      // Import from the central exports
      const { bookingFieldMappings } = require('@/rails/src/mapping');
      fieldMappings = bookingFieldMappings;
    } else if (tableName === 'lessons' && allTables) {
      const { lessonFieldMappings } = require('@/rails/src/mapping');
      fieldMappings = lessonFieldMappings;
    }
    // Add more table types here as needed
  }

  // Load async mappings for API-based relations
  useEffect(() => {
    const loadAsyncMappings = async () => {
      if (!fieldMappings || !fieldMappings.length || !allTables || !table.data.length) return;
      
      // Only process mappings that use API
      const apiMappings = fieldMappings.filter(mapping => mapping.useApi);
      if (!apiMappings.length) return;
      
      // Process each row asynchronously
      const newMappedValues: Record<string, Record<string, string>> = {};
      
      for (const [rowIndex, row] of table.data.entries()) {
        try {
          const mappedRow = await mapRelatedFieldsAsync(row, allTables, apiMappings);
          newMappedValues[rowIndex] = mappedRow;
        } catch (error) {
          console.error('Error mapping row with API:', error);
        }
      }
      
      setAsyncMappedValues(newMappedValues);
    };
    
    loadAsyncMappings();
  }, [fieldMappings, allTables, table.data]);

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

  // Only apply mappings if we have them and tables to resolve with
  const hasMappings = fieldMappings && fieldMappings.length > 0 && allTables;

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
          {table.data.map((row, rowIndex) => {
            // Pre-calculate mapped values for this row - use sync mappings for non-API fields
            const nonApiMappings = fieldMappings?.filter(m => !m.useApi) || [];
            const mappedValues = hasMappings && nonApiMappings.length > 0 && allTables
              ? mapRelatedFields(row, allTables, nonApiMappings)
              : {};
              
            // Get any async mapped values that have been loaded
            const asyncValues = asyncMappedValues[rowIndex] || {};
            
            // Combine sync and async mapped values
            const combinedMappedValues = { ...mappedValues, ...asyncValues };
              
            return (
              <tr key={rowIndex} className="border-b">
                {table.fields.map((field) => {
                  const fieldKey = field.name;
                  const hasMappedValue = hasMappings && combinedMappedValues && fieldKey in combinedMappedValues;
                  
                  return (
                    <td
                      key={fieldKey}
                      className="p-3 text-sm"
                    >
                      {fieldKey === "id" ? (
                        <Link
                          href={`${pathname}/${row[fieldKey]}`}
                          className="text-primary hover:text-primary/80"
                        >
                          {row[fieldKey]}
                        </Link>
                      ) : hasMappedValue ? (
                        // Use the mapped value if available
                        combinedMappedValues[fieldKey]
                      ) : field.type === 'date' ? (
                        formatDate(row[fieldKey])
                      ) : field.type === 'price' || fieldKey.includes('price') || fieldKey.includes('cost') ? (
                        // Apply currency formatting to price fields
                        formatCurrency(row[fieldKey])
                      ) : field.type === 'duration' || fieldKey.includes('duration') || fieldKey.includes('minutes') ? (
                        // Apply duration formatting to duration fields
                        formatDuration(row[fieldKey], true)
                      ) : fieldKey === 'status' ? (
                        // Apply status formatting with proper styling based on table type
                        <span className={formatStatus(row[fieldKey], 
                                       tableName === 'bookings' ? BOOKING_STATUS_MAP : 
                                       tableName === 'lessons' ? LESSON_STATUS_MAP : {}).className}>
                          {formatStatus(row[fieldKey], 
                                       tableName === 'bookings' ? BOOKING_STATUS_MAP : 
                                       tableName === 'lessons' ? LESSON_STATUS_MAP : {}).text}
                        </span>
                      ) : (
                        Array.isArray(row[fieldKey])
                          ? row[fieldKey].join(", ")
                          : String(row[fieldKey] || '')
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}