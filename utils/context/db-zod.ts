/**
 * Database schema definitions using Zod
 * 
 * This file centralizes all table schema definitions using Zod for validation,
 * type inference, and documentation.
 */

import { z } from 'zod';

// Base table schema with common fields
const baseTableSchema = z.object({
  id: z.string().uuid().describe('Primary key'),
  created_at: z.string().datetime().optional().describe('Creation timestamp'),
  updated_at: z.string().datetime().optional().describe('Last update timestamp'),
});

// Test table schema
export const testSchema = baseTableSchema.extend({
  funny: z.string().min(1).describe('A funny text field')
});

// Students table schema
export const studentSchema = baseTableSchema.extend({
  name: z.string().min(1).describe('Student name'),
  email: z.string().email().describe('Student email address'),
  age: z.number().int().min(5).max(120).optional().describe('Student age'),
  language: z.string().min(1).optional().describe('Preferred language'),
  bookingsId: z.array(z.string()).optional().describe('Associated booking IDs'),
  lessonsId: z.array(z.string()).optional().describe('Associated lesson IDs'),
  availabilitysId: z.array(z.string()).optional().describe('Associated availability IDs'),
});

// Teachers table schema
export const teacherSchema = baseTableSchema.extend({
  name: z.string().min(1).describe('Teacher name'),
  language: z.string().min(1).describe('Teaching language'),
  qualifications: z.string().optional().describe('Teacher qualifications'),
  lessonsId: z.array(z.string()).optional().describe('Associated lesson IDs'),
  sessionsId: z.array(z.string()).optional().describe('Associated session IDs'),
});

// Bookings table schema
export const bookingSchema = baseTableSchema.extend({
  studentId: z.string().uuid().describe('Associated student ID'),
  teacherId: z.string().uuid().describe('Associated teacher ID'),
  dateTime: z.string().datetime().describe('Booking date and time'),
  status: z.enum(['pending', 'confirmed', 'cancelled']).describe('Booking status'),
  notes: z.string().optional().describe('Additional booking notes'),
});

// Lessons table schema
export const lessonSchema = baseTableSchema.extend({
  teacherId: z.string().uuid().describe('Associated teacher ID'),
  studentId: z.string().uuid().describe('Associated student ID'),
  status: z.enum(['scheduled', 'completed', 'cancelled']).describe('Lesson status'),
  bookingId: z.string().uuid().optional().describe('Associated booking ID'),
  duration: z.number().int().min(15).describe('Lesson duration in minutes'),
  topic: z.string().optional().describe('Lesson topic'),
  completed: z.boolean().default(false).describe('Whether the lesson is completed'),
});

// Define table config with schema and table name
export interface TableConfig<T extends z.ZodType> {
  name: string;
  schema: T;
  primaryKey: string;
}

// Collection of all table configurations
export const DB_TABLES: { [key: string]: TableConfig<any> } = {
  test: {
    name: 'test',
    schema: testSchema,
    primaryKey: 'id',
  },
  students: {
    name: 'students',
    schema: studentSchema,
    primaryKey: 'id',
  },
  teachers: {
    name: 'teachers',
    schema: teacherSchema,
    primaryKey: 'id',
  },
  bookings: {
    name: 'bookings',
    schema: bookingSchema,
    primaryKey: 'id',
  },
  lessons: {
    name: 'lessons',
    schema: lessonSchema,
    primaryKey: 'id',
  },
};

// Helper types for inferring schema types
export type TestTable = z.infer<typeof testSchema>;
export type StudentTable = z.infer<typeof studentSchema>;
export type TeacherTable = z.infer<typeof teacherSchema>;
export type BookingTable = z.infer<typeof bookingSchema>;
export type LessonTable = z.infer<typeof lessonSchema>;

// Helper types for the whole database
export type DbTables = typeof DB_TABLES;
export type DbTableNames = keyof DbTables;

// Helper function to convert Zod schema to table fields
export function getFieldsFromSchema(schema: z.ZodType): Array<{
  name: string;
  type: string;
  required: boolean;
  isPrimaryKey: boolean;
  description?: string;
}> {
  // Get the schema shape for object schemas
  const shape = (schema as any)._def?.shape || {};
  
  // Extract field metadata from Zod schema
  return Object.entries(shape).map(([key, value]: [string, any]) => {
    const field = value as z.ZodTypeAny;
    const isOptional = field.isOptional?.() || false;
    
    // Determine field type
    let type = 'string';
    if (field instanceof z.ZodNumber) type = 'number';
    if (field instanceof z.ZodBoolean) type = 'boolean';
    if (field instanceof z.ZodArray) type = 'array';
    if (field instanceof z.ZodEnum) type = 'enum';
    if (field instanceof z.ZodDate) type = 'date';
    
    // Get description from Zod metadata
    const description = field._def?.description;
    
    return {
      name: key,
      type,
      required: !isOptional,
      isPrimaryKey: key === 'id', // We're assuming 'id' is always the primary key
      description
    };
  });
}