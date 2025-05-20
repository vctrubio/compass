/**
 * Enhanced lesson mapping with booking and teacher data
 */
import { TableEntity } from '@/rails/types';
import { FieldMapping } from './relationMapping';
import { formatDate } from '@/rails/src/formatters';

/**
 * Maps a lesson to include detailed booking and teacher information
 * 
 * @param lessonId Lesson ID to map
 * @param tables All available tables
 * @returns A complete lesson display object
 */
export async function mapLessonWithRelations(
  lessonId: number | string,
  tables: Record<string, TableEntity>
): Promise<Record<string, any>> {
  if (!tables.lessons || !tables.lessons.api) {
    return { error: 'Lessons table not available' };
  }
  
  try {
    // Fetch lesson details using API
    const lesson = await tables.lessons.api.getId(lessonId);
    if (!lesson) return { error: 'Lesson not found' };
    
    // Build enhanced lesson object
    const enhancedLesson: Record<string, any> = { ...lesson };
    
    // Add teacher information
    if (lesson.teacher_id && tables.teachers?.api) {
      try {
        const teacher = await tables.teachers.api.getId(lesson.teacher_id);
        if (teacher) {
          enhancedLesson.teacherDetails = {
            name: teacher.name,
            email: teacher.email,
            languages: teacher.languages
          };
        }
      } catch (error) {
        console.error('Error fetching teacher:', error);
      }
    }
    
    // Add booking information
    if (lesson.booking_id && tables.bookings?.api) {
      try {
        const booking = await tables.bookings.api.getId(lesson.booking_id);
        if (booking) {
          enhancedLesson.bookingDetails = {
            date: formatDate(booking.start_date),
            package_id: booking.package_id,
            student_id: booking.student_id
          };
          
          // Add student information
          if (booking.student_id && tables.students?.api) {
            try {
              const student = await tables.students.api.getId(booking.student_id);
              if (student) {
                enhancedLesson.studentDetails = {
                  name: student.name,
                  email: student.email,
                  age: student.age
                };
              }
            } catch (error) {
              console.error('Error fetching student:', error);
            }
          }
          
          // Add package information
          if (booking.package_id && tables.packages?.api) {
            try {
              const pkg = await tables.packages.api.getId(booking.package_id);
              if (pkg) {
                enhancedLesson.packageDetails = {
                  hours: pkg.hours,
                  capacity: pkg.capacity,
                  price: pkg.price
                };
              }
            } catch (error) {
              console.error('Error fetching package:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
      }
    }
    
    return enhancedLesson;
  } catch (error) {
    console.error('Error mapping lesson with relations:', error);
    return { error: 'Failed to map lesson relationships' };
  }
}

/**
 * Creates a fully detailed field mapping for lesson detail pages
 */
export function getLessonDetailMappings(): FieldMapping[] {
  // These mappings would be used in detail views, not tables
  return [];
}
