/**
 * Teacher mapping utilities
 */
import { TableEntity } from '@/rails/types';
import { Teacher } from '@/rails/model/teacher';
import { resolveRelation } from './relationMapping';

/**
 * Maps a teacher ID to the teacher's name
 * 
 * @param {number|string} teacherId - The teacher ID
 * @param {TableEntity} teachersTable - The teachers table data
 * @returns {string} The teacher's name or "Unknown teacher"
 */
export function mapTeacherName(
  teacherId: number | string | null | undefined,
  teachersTable: TableEntity | null | undefined
): string {
  return resolveRelation(teacherId, teachersTable, 'name', 'id', 'Unknown teacher');
}

/**
 * Maps a teacher ID to the teacher's name and email
 * 
 * @param {number|string} teacherId - The teacher ID
 * @param {TableEntity} teachersTable - The teachers table data
 * @returns {string} A formatted string with name and email
 */
export function mapTeacherDetail(
  teacherId: number | string | null | undefined,
  teachersTable: TableEntity | null | undefined
): string {
  if (teacherId === null || teacherId === undefined || !teachersTable || !teachersTable.data) {
    return 'Unknown teacher';
  }

  const teacher = teachersTable.data.find((t: any) => 
    t.id?.toString() === teacherId.toString()
  );

  if (!teacher) return 'Unknown teacher';

  // Format: "Name (Email)"
  return teacher.email 
    ? `${teacher.name} (${teacher.email})`
    : teacher.name;
}

/**
 * Maps a teacher ID to the teacher's name and specialization
 * 
 * @param {number|string} teacherId - The teacher ID
 * @param {TableEntity} teachersTable - The teachers table data
 * @returns {string} A formatted string with name and specialization
 */
export function mapTeacherWithSpecialization(
  teacherId: number | string | null | undefined,
  teachersTable: TableEntity | null | undefined
): string {
  if (teacherId === null || teacherId === undefined || !teachersTable || !teachersTable.data) {
    return 'Unknown teacher';
  }

  const teacher = teachersTable.data.find((t: any) => 
    t.id?.toString() === teacherId.toString()
  );

  if (!teacher) return 'Unknown teacher';

  // Format: "Name - Specialization"
  return teacher.specialization 
    ? `${teacher.name} - ${teacher.specialization}`
    : teacher.name;
}

/**
 * Default field mappings for the teachers table
 */
export const teacherFieldMappings = [];  // Add mappings as needed

/**
 * Gets mappings for a teacher based on context
 * 
 * @param {string} context - The context identifier (e.g., 'table', 'detail')
 * @returns {Array} The appropriate field mappings for the context
 */
export function getTeacherMappings(context: string = 'table') {
  if (context === 'detail') {
    // Return more detailed mappings for the detail view
    return [
      ...teacherFieldMappings,
      // Add additional mappings for the detail view
    ];
  }
  
  // Default to standard table mappings
  return teacherFieldMappings;
}
