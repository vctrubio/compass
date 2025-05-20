# Database Field Naming Conventions

## Overview
This project uses `snake_case` for all database field names to maintain consistency between the database schema and application code.

## Schema Files
- The database schema is defined in `/drizzle/schema.ts`
- All field names use `snake_case` format (e.g., `start_date`, `student_id`)

## Application Code
- The application code for forms and models follows the same `snake_case` format
- Form fields, model properties, and API responses all use the same naming convention

## Migrations
- When creating new database migrations, always use `snake_case` for field names
- Use the SQL script `update-field-names.sql` as a reference if needed

## Consistency Check
To verify your field naming is consistent throughout the application:

1. Database schema in `drizzle/schema.ts` should use `snake_case`
2. Model definitions should use the same field names as the database
3. Form field names should match model field names
4. API requests/responses should use the same field names

## Existing Fields
The following database columns use `snake_case`:

- `id`
- `name`
- `email`
- `phone`
- `languages`
- `age`
- `auth_id` (formerly `authId`)
- `user_id` (formerly `userId`)
- `role`
- `type`
- `model`
- `size`
- `price`
- `hours`
- `capacity`
- `description`
- `created_at` (formerly `createdAt`)
- `package_id` (formerly `packageId`)
- `student_id` (formerly `studentId`)
- `start_date` (formerly `startDate`)
- `equipment_ids` (formerly `equipmentIds`)
- `start_time` (formerly `startTime`)
- `duration`
- `cash`
- `amount`
- `student_confirmation` (formerly `studentConfirmation`)
- `teacher_id` (formerly `teacherId`)
- `booking_id` (formerly `bookingId`)
- `payment_id` (formerly `paymentId`)
- `post_lesson_id` (formerly `postLessonId`)
- `status`
- `lesson_id` (formerly `lessonId`)
- `session_id` (formerly `sessionId`)
- `availability_window_id` (formerly `availabilityWindowId`)
- `end_date` (formerly `endDate`)

## How to Make Field Name Changes

If you need to modify a field name:

1. Update the Drizzle schema file (`drizzle/schema.ts`)
2. Run `npm run db:generate` to create a migration
3. Run `npm run db:push` to apply the changes to the database
4. Update any related model files and form components
