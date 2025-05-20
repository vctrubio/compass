/**
 * Utility functions for mapping relationship IDs to display values
 */

import { TableEntity } from "@/rails/types";

/**
 * Maps a foreign key ID to a human-readable display value from a related table
 * 
 * @param {number|string} id - The foreign key ID to resolve
 * @param {TableEntity} relatedTable - The related table data object
 * @param {string} displayField - The field from the related entity to display (e.g., 'name')
 * @param {string} idField - The field in the related entity that matches the foreign key (default: 'id')
 * @param {string} fallback - Value to display if the relation is not found
 * @returns {string} The display value or fallback
 */
export function resolveRelation(
  id: number | string | null | undefined,
  relatedTable: TableEntity | null | undefined,
  displayField: string,
  idField: string = 'id',
  fallback: string = 'Unknown'
): string {
  if (id === null || id === undefined || !relatedTable || !relatedTable.data) {
    return fallback;
  }

  const relatedRecord = relatedTable.data.find((record: any) => 
    record[idField]?.toString() === id.toString()
  );

  return relatedRecord ? relatedRecord[displayField]?.toString() || fallback : fallback;
}

/**
 * Asynchronously resolves a relation using the table's API
 * 
 * @param {number|string} id - The foreign key ID to resolve
 * @param {TableEntity} relatedTable - The related table data object
 * @param {string} displayField - The field to display from the related entity
 * @param {string} idField - The ID field in the related entity
 * @param {string} fallback - Value to display if the relation is not found
 * @returns {Promise<string>} The display value or fallback
 */
export async function resolveRelationAsync(
  id: number | string | null | undefined,
  relatedTable: TableEntity | null | undefined,
  displayField: string,
  idField: string = 'id',
  fallback: string = 'Unknown'
): Promise<string> {
  if (id === null || id === undefined || !relatedTable || !relatedTable.api) {
    return fallback;
  }

  try {
    // Use the table API to get the specific record
    const record = await relatedTable.api.getId(id);
    
    if (!record || !record[displayField]) {
      return fallback;
    }
    
    return record[displayField].toString() || fallback;
  } catch (error) {
    console.error(`Error resolving relation for ID ${id}:`, error);
    return fallback;
  }
}

/**
 * Configuration interface for field mappings
 */
export interface FieldMapping {
  sourceField: string;  // The original field in the data (e.g., 'student_id')
  targetTable: string;  // The table to look up the relation (e.g., 'students')
  displayField: string; // The field to display from the related table (e.g., 'name')
  formatter?: (value: any, tables?: Record<string, TableEntity>) => string; // Optional custom formatter
  label?: string;       // Optional display label override
  modelType?: string;   // Reference to the model type (e.g., 'Student', 'Booking')
  useApi?: boolean;     // Whether to use API for fetching the related data
}

/**
 * Maps all configured fields in a record using related tables
 * 
 * @param {any} record - The record containing foreign keys
 * @param {Record<string, TableEntity>} tables - All available tables
 * @param {FieldMapping[]} mappings - Mapping configurations
 * @returns {Record<string, string>} Mapped values keyed by original field names
 */
export function mapRelatedFields(
  record: any,
  tables: Record<string, TableEntity>,
  mappings: FieldMapping[]
): Record<string, string> {
  const result: Record<string, string> = {};

  mappings.forEach(mapping => {
    const value = record[mapping.sourceField];
    const relatedTable = tables[mapping.targetTable];
    
    let displayValue: string;
    
    if (mapping.formatter) {
      // If a custom formatter is provided, use it with tables
      displayValue = mapping.formatter(value, tables);
    } else {
      // Otherwise use the standard relation resolver
      displayValue = resolveRelation(value, relatedTable, mapping.displayField);
    }

    // Include model type info if available
    const modelPrefix = mapping.modelType ? `${mapping.modelType}: ` : '';
    
    // Store the result using the original field name
    result[mapping.sourceField] = mapping.label 
      ? `${mapping.label}: ${displayValue}`
      : modelPrefix + displayValue;
  });

  return result;
}

/**
 * Maps all configured fields in a record using related tables with API support
 * This async version can be used when API lookups are needed
 * 
 * @param {any} record - The record containing foreign keys
 * @param {Record<string, TableEntity>} tables - All available tables
 * @param {FieldMapping[]} mappings - Mapping configurations
 * @returns {Promise<Record<string, string>>} Mapped values keyed by original field names
 */
export async function mapRelatedFieldsAsync(
  record: any,
  tables: Record<string, TableEntity>,
  mappings: FieldMapping[]
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const mappingPromises: Promise<void>[] = [];

  for (const mapping of mappings) {
    const value = record[mapping.sourceField];
    const relatedTable = tables[mapping.targetTable];
    
    const processMapping = async () => {
      let displayValue: string;
      
      if (mapping.formatter && mapping.useApi) {
        try {
          // Check if the formatter has an async version
          const asyncFormatterName = mapping.formatter.name + 'Async';
          const mappingModule = mapping.formatter.toString().includes('require') 
            ? require(mapping.formatter.toString().match(/require\(['"](.+)['"]\)/)?.[1] || './relationMapping')
            : null;
            
          if (mappingModule && typeof mappingModule[asyncFormatterName] === 'function') {
            // Use the async version of the formatter if available
            displayValue = await mappingModule[asyncFormatterName](value, tables);
          } else {
            // Fall back to the synchronous formatter
            displayValue = mapping.formatter(value, tables);
          }
        } catch (error) {
          console.error(`Error using async formatter for ${mapping.sourceField}:`, error);
          displayValue = mapping.formatter(value, tables);
        }
      } else if (mapping.useApi && relatedTable?.api) {
        try {
          // Use API to fetch the related record
          const relatedRecord = await relatedTable.api.getId(value);
          displayValue = relatedRecord ? relatedRecord[mapping.displayField]?.toString() || 'Unknown' : 'Unknown';
        } catch (error) {
          console.error(`Error fetching relation for ${mapping.sourceField}:`, error);
          displayValue = 'Error';
        }
      } else if (mapping.formatter) {
        // If a custom formatter is provided, use it with tables
        displayValue = mapping.formatter(value, tables);
      } else {
        // Otherwise use the standard relation resolver
        displayValue = resolveRelation(value, relatedTable, mapping.displayField);
      }
      
      // Include model type info if available
      const modelPrefix = mapping.modelType ? `${mapping.modelType}: ` : '';
      
      // Store the result
      result[mapping.sourceField] = mapping.label 
        ? `${mapping.label}: ${displayValue}`
        : modelPrefix + displayValue;
    };
    
    mappingPromises.push(processMapping());
  }
  
  // Wait for all mappings to complete
  await Promise.all(mappingPromises);
  
  return result;
}
