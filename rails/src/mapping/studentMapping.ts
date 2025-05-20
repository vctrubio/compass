/**
 * Student mapping utilities
 */
import { TableEntity } from '@/rails/types';
import { Student } from '@/rails/model/student';
import { resolveRelation } from './relationMapping';

/**
 * Maps a student ID to the student's name
 * 
 * @param {number|string} studentId - The student ID
 * @param {TableEntity} studentsTable - The students table data
 * @returns {string} The student's name or "Unknown student"
 */
export function mapStudentName(
  studentId: number | string | null | undefined,
  studentsTable: TableEntity | null | undefined
): string {
  return resolveRelation(studentId, studentsTable, 'name', 'id', 'Unknown student');
}

/**
 * Maps a student ID to the student's name and email
 * 
 * @param {number|string} studentId - The student ID
 * @param {TableEntity} studentsTable - The students table data
 * @returns {string} A formatted string with name and email
 */
export function mapStudentDetail(
  studentId: number | string | null | undefined,
  studentsTable: TableEntity | null | undefined
): string {
  if (studentId === null || studentId === undefined || !studentsTable || !studentsTable.data) {
    return 'Unknown student';
  }

  const student = studentsTable.data.find((s: any) => 
    s.id?.toString() === studentId.toString()
  );

  if (!student) return 'Unknown student';

  return student.email 
    ? `${student.name} (${student.email})`
    : student.name;
}
