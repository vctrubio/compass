/**
 * Session-specific mapping utilities and configurations
 */
import { FieldMapping } from './relationMapping';
import { TableEntity } from '@/rails/types';

/**
 * Maps equipment IDs array to a comprehensive summary of equipment details
 * 
 * @param {number[]} equipmentIds - Array of equipment IDs
 * @param {Record<string, TableEntity>} tables - All tables data for resolution
 * @returns {string} A formatted equipment summary
 */
export function mapEquipmentDetails(
  equipmentIds: number[] | null | undefined,
  tables?: Record<string, TableEntity>
): string {
  if (!equipmentIds || !Array.isArray(equipmentIds) || equipmentIds.length === 0 || !tables) {
    return 'No equipment';
  }

  const equipmentTable = tables.equipment;
  if (!equipmentTable || !equipmentTable.data) {
    return `${equipmentIds.length} equipment items`;
  }

  // Map each ID to its equipment details
  const equipmentDetails = equipmentIds.map(id => {
    const equipment = equipmentTable.data.find((e: any) => e.id?.toString() === id.toString());
    
    if (!equipment) {
      return `Equipment #${id}`;
    }
    
    // Format as "Type: Model (Size)"
    return `${equipment.type.charAt(0).toUpperCase() + equipment.type.slice(1)}: ${equipment.model} (${equipment.size})`;
  });

  // Join the details with commas and limit if too many
  if (equipmentDetails.length > 3) {
    return `${equipmentDetails.slice(0, 3).join(', ')} +${equipmentDetails.length - 3} more`;
  }
  
  return equipmentDetails.join(', ');
}

/**
 * Default field mappings for the sessions table
 */
export const sessionFieldMappings: FieldMapping[] = [
  {
    sourceField: 'equipment_ids',
    targetTable: 'equipment',
    displayField: 'model',
    formatter: (equipmentIds: number[], tables?: Record<string, TableEntity>) => {
      if (!tables) return 'Unknown equipment';
      return mapEquipmentDetails(equipmentIds, tables);
    },
    label: 'Equipment',
    modelType: 'Equipment',
    useApi: true
  },
  {
    sourceField: 'start_time',
    targetTable: '',
    displayField: '',
    formatter: (startTime: string) => {
      if (!startTime) return 'Unknown time';
      const date = new Date(startTime);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    label: 'Start Time',
    useApi: false
  }
];

/**
 * Gets mappings for a session based on context
 * 
 * @param {string} context - The context identifier (e.g., 'table', 'detail')
 * @returns {FieldMapping[]} The appropriate field mappings for the context
 */
export function getSessionMappings(context: string = 'table'): FieldMapping[] {
  // For now, we use the same mappings for all contexts
  return sessionFieldMappings;
}
