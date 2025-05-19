export const ALL_TABLE_NAMES = [
  'admins',
  'availability_windows',
  'bookings',
  'equipment',
  'lesson_sessions',
  'lessons',
  'packages',
  'payments',
  'post_lessons',
  'sessions',
  'student_availability_windows',
  'students',
  'teachers'
] as const;

export const ADMIN_TABLE_NAMES = [
  'bookings',
  'equipment',
  'lessons',
  'packages',
  'sessions',
  'students',
  'teachers',
] as const;

export const STUDENTS_TABLE_NAMES = [
  'students',
  'packages',
  'bookings',
  'lessons'
] as const;

export const TEACHERS_TABLE_NAMES = [
  'lessons',
  'sessions'
] as const;
