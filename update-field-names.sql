-- SQL script to update any camelCase field names to snake_case
-- Run this on your database to ensure all fields use snake_case naming

-- Update students table
ALTER TABLE IF EXISTS students 
  RENAME COLUMN "authId" TO "auth_id";

-- Update teachers table
ALTER TABLE IF EXISTS teachers 
  RENAME COLUMN "authId" TO "auth_id";

-- Update admins table
ALTER TABLE IF EXISTS admins 
  RENAME COLUMN "userId" TO "user_id";

-- Update availability_windows table
ALTER TABLE IF EXISTS availability_windows 
  RENAME COLUMN "startDate" TO "start_date",
  RENAME COLUMN "endDate" TO "end_date",
  RENAME COLUMN "createdAt" TO "created_at";

-- Update student_availability_windows table
ALTER TABLE IF EXISTS student_availability_windows 
  RENAME COLUMN "studentId" TO "student_id",
  RENAME COLUMN "availabilityWindowId" TO "availability_window_id";

-- Update bookings table
ALTER TABLE IF EXISTS bookings 
  RENAME COLUMN "packageId" TO "package_id",
  RENAME COLUMN "studentId" TO "student_id",
  RENAME COLUMN "startDate" TO "start_date",
  RENAME COLUMN "createdAt" TO "created_at";

-- Update sessions table
ALTER TABLE IF EXISTS sessions 
  RENAME COLUMN "equipmentIds" TO "equipment_ids",
  RENAME COLUMN "startTime" TO "start_time";

-- Update payments table
ALTER TABLE IF EXISTS payments 
  RENAME COLUMN "createdDate" TO "created_at";

-- Update post_lessons table
ALTER TABLE IF EXISTS post_lessons 
  RENAME COLUMN "studentConfirmation" TO "student_confirmation";

-- Update lessons table
ALTER TABLE IF EXISTS lessons 
  RENAME COLUMN "teacherId" TO "teacher_id",
  RENAME COLUMN "bookingId" TO "booking_id",
  RENAME COLUMN "paymentId" TO "payment_id",
  RENAME COLUMN "postLessonId" TO "post_lesson_id",
  RENAME COLUMN "createdAt" TO "created_at";

-- Update lesson_sessions table
ALTER TABLE IF EXISTS lesson_sessions 
  RENAME COLUMN "lessonId" TO "lesson_id",
  RENAME COLUMN "sessionId" TO "session_id";

-- Note: This script uses IF EXISTS to prevent errors if columns have already been renamed
-- Warning: Make sure to backup your database before running this script
