/**
 * Booking-specific mapping utilities and configurations
 */
import { FieldMapping } from './relationMapping';
import { mapStudentName, mapStudentDetail } from './studentMapping';
import { mapPackageSummary, mapPackageDetail } from './packageMapping';
import { TableEntity } from '@/rails/types';
import { Booking } from '@/rails/model/booking';

/**
 * Default field mappings for the bookings table
 */
export const bookingFieldMappings: FieldMapping[] = [
  {
    sourceField: 'student_id',
    targetTable: 'students',
    displayField: 'name',
    formatter: (studentId: number | string, tables?: Record<string, TableEntity>) => {
      if (!tables) return 'Unknown student';
      return mapStudentName(studentId, tables.students);
    },
    label: 'Student',
    modelType: 'Student',
    useApi: true
  },
  {
    sourceField: 'package_id',
    targetTable: 'packages',
    displayField: 'id', // Doesn't matter as we use a custom formatter
    formatter: (packageId: number | string, tables?: Record<string, TableEntity>) => {
      if (!tables) return 'Unknown package';
      return mapPackageSummary(packageId, tables.packages);
    },
    label: 'Package',
    modelType: 'Package',
    useApi: true
  }
];

/**
 * Gets mappings for a booking based on context
 * 
 * @param {string} context - The context identifier (e.g., 'table', 'detail')
 * @returns {FieldMapping[]} The appropriate field mappings for the context
 */
export function getBookingMappings(context: string = 'table'): FieldMapping[] {
  if (context === 'detail') {
    // Return more detailed mappings for the detail view
    return [
      {
        sourceField: 'student_id',
        targetTable: 'students',
        displayField: 'name',
        formatter: (studentId: number | string, tables?: Record<string, TableEntity>) => {
          if (!tables) return 'Unknown student';
          return mapStudentDetail(studentId, tables.students);
        },
        label: 'Student',
        modelType: 'Student',
        useApi: true
      },
      {
        sourceField: 'package_id',
        targetTable: 'packages',
        displayField: 'id',
        formatter: (packageId: number | string, tables?: Record<string, TableEntity>) => {
          if (!tables) return 'Unknown package';
          return mapPackageDetail(packageId, tables.packages);
        },
        label: 'Package',
        modelType: 'Package',
        useApi: true
      }
    ];
  }
  
  // Default to standard table mappings
  return bookingFieldMappings;
}
