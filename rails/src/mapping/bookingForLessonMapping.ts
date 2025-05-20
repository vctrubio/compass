/**
 * Booking mapping functions specifically for displaying in the lesson table
 */
import { TableEntity } from '@/rails/types';
import { resolveRelation } from './relationMapping';

/**
 * Maps a booking ID to a comprehensive booking summary for lesson tables
 * Shows: capacity, hours, and student name
 * 
 * @param {number|string} bookingId - The booking ID 
 * @param {Record<string, TableEntity>} tables - All tables for resolving relations
 * @returns {string} A formatted booking summary
 */
export function mapBookingForLessons(
  bookingId: number | string | null | undefined,
  tables?: Record<string, TableEntity>
): string {
  if (bookingId === null || bookingId === undefined || !tables) {
    return 'Unknown booking';
  }

  const bookingsTable = tables.bookings;
  if (!bookingsTable || !bookingsTable.data) {
    return `Booking #${bookingId}`;
  }

  const booking = bookingsTable.data.find((b: any) => 
    b.id?.toString() === bookingId.toString()
  );

  if (!booking) {
    return `Booking #${bookingId}`;
  }

  // Get package information
  let packageInfo = '';
  if (booking.package_id && tables.packages?.data) {
    const pkg = tables.packages.data.find((p: any) => 
      p.id?.toString() === booking.package_id.toString()
    );
    
    if (pkg) {
      packageInfo = `${pkg.capacity} ppl, ${pkg.hours}hrs`;
    }
  }

  // Get student information
  let studentName = '';
  if (booking.student_id && tables.students?.data) {
    const student = tables.students.data.find((s: any) => 
      s.id?.toString() === booking.student_id.toString()
    );
    
    if (student) {
      studentName = student.name;
    }
  }

  // Format: "capacity ppl, hours hrs - student name"
  // Handle cases where some information might be missing
  if (packageInfo && studentName) {
    return `${packageInfo} - ${studentName}`;
  } else if (packageInfo) {
    return packageInfo;
  } else if (studentName) {
    return studentName;
  } else {
    return `Booking #${bookingId}`;
  }
}

/**
 * Asynchronously maps a booking ID to a comprehensive booking summary
 * This version uses API calls to get the latest data
 * 
 * @param {number|string} bookingId - The booking ID 
 * @param {Record<string, TableEntity>} tables - All tables with APIs
 * @returns {Promise<string>} A formatted booking summary
 */
export async function mapBookingForLessonsAsync(
  bookingId: number | string | null | undefined,
  tables?: Record<string, TableEntity>
): Promise<string> {
  if (bookingId === null || bookingId === undefined || !tables || !tables.bookings?.api) {
    return 'Unknown booking';
  }

  try {
    // Use API to get booking details
    const booking = await tables.bookings.api.getId(bookingId);
    if (!booking) {
      return `Booking #${bookingId}`;
    }

    // Get package information via API
    let packageInfo = '';
    if (booking.package_id && tables.packages?.api) {
      try {
        const pkg = await tables.packages.api.getId(booking.package_id);
        if (pkg) {
          packageInfo = `${pkg.capacity} ppl, ${pkg.hours}hrs`;
        }
      } catch (error) {
        console.error('Error fetching package:', error);
      }
    }

    // Get student information via API
    let studentName = '';
    if (booking.student_id && tables.students?.api) {
      try {
        const student = await tables.students.api.getId(booking.student_id);
        if (student) {
          studentName = student.name;
        }
      } catch (error) {
        console.error('Error fetching student:', error);
      }
    }

    // Format the output
    if (packageInfo && studentName) {
      return `${packageInfo} - ${studentName}`;
    } else if (packageInfo) {
      return packageInfo;
    } else if (studentName) {
      return studentName;
    } else {
      return `Booking #${bookingId}`;
    }
  } catch (error) {
    console.error('Error mapping booking for lessons:', error);
    return `Booking #${bookingId} (error)`;
  }
}
