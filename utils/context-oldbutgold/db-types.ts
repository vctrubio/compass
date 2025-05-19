/**
 * Database table schema definitions
 * 
 * This file centralizes all table schema definitions in one place.
 * Each table is defined with its name and column types.
 */

export interface TableSchema {
  tableName: string;
  tableColumns: Record<string, string>;
  primaryKey?: string;
  requiredFields?: string[];
}

// Test table schema
export const TEST_DB: TableSchema = {
  tableName: 'test',
  tableColumns: {
    "id": "string",
    "funny": "string"
  },
  primaryKey: "id",
  requiredFields: ["id"]
};

// Define other tables here
export const STUDENTS_DB: TableSchema = {
  tableName: 'students',
  tableColumns: {
    "id": "string",
    "name": "string",
    "email": "string",
    "age": "number",
    "language": "string"
  },
  primaryKey: "id",
  requiredFields: ["id", "name", "email"]
};

export const TEACHERS_DB: TableSchema = {
  tableName: 'teachers',
  tableColumns: {
    "id": "string",
    "name": "string",
    "language": "string",
    "qualifications": "string"
  },
  primaryKey: "id",
  requiredFields: ["id", "name"]
};

export const BOOKINGS_DB: TableSchema = {
  tableName: 'bookings',
  tableColumns: {
    "id": "string",
    "studentId": "string",
    "teacherId": "string",
    "dateTime": "datetime",
    "status": "string",
    "notes": "string"
  },
  primaryKey: "id",
  requiredFields: ["id", "studentId", "teacherId", "dateTime"]
};

export const LESSONS_DB: TableSchema = {
  tableName: 'lessons',
  tableColumns: {
    "id": "string",
    "bookingId": "string",
    "duration": "number",
    "topic": "string",
    "completed": "boolean"
  },
  primaryKey: "id",
  requiredFields: ["id", "bookingId"]
};

// Collection of all table schemas
export const DB_SCHEMAS: TableSchema[] = [
  TEST_DB,
  STUDENTS_DB,
  TEACHERS_DB,
  BOOKINGS_DB,
  LESSONS_DB
];

// Helper function to get a table schema by name
export function getTableSchema(tableName: string): TableSchema | undefined {
  return DB_SCHEMAS.find(schema => schema.tableName === tableName);
}