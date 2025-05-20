/**
 * Lesson mapping utilities
 */
import { TableEntity } from '@/rails/types';
import { Lesson, lessonStatusValues } from '@/rails/model/lesson';
import { resolveRelation } from './relationMapping';
import { mapTeacherName } from './teacherMapping';
import { BOOKING_STATUS_MAP } from '@/rails/src/formatters';

/**
 * Maps a lesson ID to a concise description
 * 
 * @param {number|string} lessonId - The lesson ID
 * @param {TableEntity} lessonsTable - The lessons table data
 * @returns {string} A formatted lesson description
 */
export function mapLessonSummary(
  lessonId: number | string | null | undefined,
  lessonsTable: TableEntity | null | undefined
): string {
  if (lessonId === null || lessonId === undefined || !lessonsTable || !lessonsTable.data) {
    return 'Unknown lesson';
  }

  const lesson = lessonsTable.data.find((l: any) => 
    l.id?.toString() === lessonId.toString()
  );

  if (!lesson) return 'Unknown lesson';

  // Format: "Type (Duration)"
  return `${lesson.type || 'Lesson'} (${lesson.duration || '?'} min)`;
}

/**
 * Maps a lesson ID to a detailed description
 * 
 * @param {number|string} lessonId - The lesson ID
 * @param {TableEntity} lessonsTable - The lessons table data
 * @returns {string} A detailed lesson description
 */
export function mapLessonDetail(
  lessonId: number | string | null | undefined,
  lessonsTable: TableEntity | null | undefined
): string {
  if (lessonId === null || lessonId === undefined || !lessonsTable || !lessonsTable.data) {
    return 'Unknown lesson';
  }

  const lesson = lessonsTable.data.find((l: any) => 
    l.id?.toString() === lessonId.toString()
  );

  if (!lesson) return 'Unknown lesson';

  // Format: "Type: Duration min - Description"
  const base = `${lesson.type || 'Lesson'}: ${lesson.duration || '?'} min`;
  
  return lesson.description
    ? `${base} - ${lesson.description}`
    : base;
}

/**
 * Default field mappings for the lessons table
 */
export const lessonFieldMappings = [
  {
    sourceField: 'teacher_id',
    targetTable: 'teachers',
    displayField: 'name',
    formatter: (teacherId: number | string, tables?: Record<string, TableEntity>) => {
      if (!tables) return 'Unknown teacher';
      return mapTeacherName(teacherId, tables.teachers);
    },
    label: 'Teacher',
    modelType: 'Teacher',
    useApi: true
  },
  {
    sourceField: 'booking_id',
    targetTable: 'bookings',
    displayField: 'id',
    formatter: (bookingId: number | string, tables?: Record<string, TableEntity>) => {
      if (!tables) return 'Unknown booking';
      
      const bookingsTable = tables.bookings;
      if (!bookingsTable?.data) return `Booking #${bookingId}`;
      
      const booking = bookingsTable.data.find((b: any) => b.id?.toString() === bookingId?.toString());
      if (!booking) return `Booking #${bookingId}`;
      
      // Get package information for capacity and hours
      let packageInfo = '';
      if (booking.package_id && tables.packages?.data) {
        const pkg = tables.packages.data.find((p: any) => p.id?.toString() === booking.package_id.toString());
        if (pkg) {
          packageInfo = `${pkg.capacity} ppl, ${pkg.hours}hrs`;
        }
      }
      
      // Get student name
      let studentName = '';
      if (booking.student_id && tables.students?.data) {
        const student = tables.students.data.find((s: any) => s.id?.toString() === booking.student_id.toString());
        if (student) {
          studentName = student.name;
        }
      }
      
      // Create a comprehensive display
      if (packageInfo && studentName) {
        return `${packageInfo} - ${studentName}`;
      } else if (packageInfo) {
        return packageInfo;
      } else if (studentName) {
        return studentName;
      } else {
        return `Booking #${bookingId}`;
      }
    },
    label: 'Booking',
    modelType: 'Booking',
    useApi: true
  },
  {
    sourceField: 'status',
    targetTable: '', // No target table for status as it's an enum value
    displayField: '',
    formatter: (status: string) => {
      // Use the formatter from formatters.ts, which will be applied in GenericTable
      // This is just a simple pass-through as the table component will handle the styling
      return status;
    },
    label: 'Status',
    modelType: 'LessonStatus'
  }
];

/**
 * Gets mappings for a lesson based on context
 * 
 * @param {string} context - The context identifier (e.g., 'table', 'detail')
 * @returns {Array} The appropriate field mappings for the context
 */
export function getLessonMappings(context: string = 'table') {
  if (context === 'detail') {
    // Return more detailed mappings for the detail view
    return [
      ...lessonFieldMappings,
      // Add additional mappings for the detail view
    ];
  }
  
  // Default to standard table mappings
  return lessonFieldMappings;
}
