// Database schema definition using snake_case for all field names
// All column names and relation fields should use snake_case (e.g., user_id, start_date)
// This ensures consistency between the database and application code
import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
  pgEnum,
  boolean,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define enums
const statusEnum = pgEnum("status", [
  "created",
  "confirmed",
  "cancelled",
  "completed",
]);

const languagesEnum = pgEnum("languages", [
  "english",
  "spanish",
  "french",
  "german",
]);

const equipmentTypeEnum = pgEnum("equipment_type", ["kite", "bar", "board"]);

// Date spans table to track availability
export const availabilityWindows = pgTable("availability_windows", {
  id: serial("id").primaryKey(),
  start_date: timestamp("start_date", { withTimezone: true }).notNull(),
  end_date: timestamp("end_date", { withTimezone: true }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Junction table for students and availability windows
export const studentAvailabilityWindows = pgTable(
  "student_availability_windows",
  {
    id: serial("id").primaryKey(),
    student_id: integer("student_id")
      .notNull()
      .references(() => students.id),
    availability_window_id: integer("availability_window_id")
      .notNull()
      .references(() => availabilityWindows.id),
  }
);

// Profile tables: students, teachers, admins
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  languages: languagesEnum("languages").array().notNull(),
  age: integer("age").notNull(),
  auth_id: text("user_id"), // For (SUPERBASE) auth system integration
});

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Changed from fullName to name
  email: text("email"),
  phone: text("phone"),
  languages: languagesEnum("languages").array().notNull(),
  auth_id: text("user_id"), // For (SUPERBASE) auth system integration
});

//later be migrated to userAuthTable from auth system
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  role: text("role").notNull(),
});

// Equipment tables
export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  type: equipmentTypeEnum("type").notNull(),
  model: text("model").notNull(),
  size: numeric("size").notNull(),
});

// Package table
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  price: integer("price").notNull(), // In euros
  hours: integer("hours").notNull(),
  capacity: integer("capacity").notNull(),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Bookings table - now directly links to a student
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  package_id: integer("package_id").notNull().references(() => packages.id),
  student_id: integer("student_id").notNull().references(() => students.id),
  start_date: timestamp("start_date", { withTimezone: true }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Equipment session table
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  equipment_ids: integer("equipment_ids").array().notNull(), // Array of equipment IDs
  start_time: timestamp("start_time", { withTimezone: true }).notNull(), // Changed from date to start_time
  duration: integer("duration").notNull(), // In minutes
});

// Payment table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  cash: boolean("cash").notNull(), // If false, it's a bank transfer
  created_at: timestamp("created_at", { withTimezone: true }).notNull(), // Changed to consistent field name
  amount: integer("amount").notNull(), // In euros
});

// Post lesson feedback table - simplified
export const postLessons = pgTable("post_lessons", {
  id: serial("id").primaryKey(),
  student_confirmation: boolean("student_confirmation").notNull(),
});

// Lesson table - combines everything
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  teacher_id: integer("teacher_id").notNull().references(() => teachers.id),
  booking_id: integer("booking_id").notNull().references(() => bookings.id),
  payment_id: integer("payment_id").references(() => payments.id),
  post_lesson_id: integer("post_lesson_id").references(() => postLessons.id),
  status: statusEnum("status").notNull().default("created"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Lesson to session many-to-many relation table
export const lessonSessions = pgTable("lesson_sessions", {
  id: serial("id").primaryKey(),
  lesson_id: integer("lesson_id").notNull().references(() => lessons.id),
  session_id: integer("session_id").notNull().references(() => sessions.id),
});

// Define relationships
export const studentsRelations = relations(students, ({ many }) => ({
  availabilityWindows: many(studentAvailabilityWindows),
  bookings: many(bookings), // Direct relation to bookings
}));

export const availabilityWindowsRelations = relations(availabilityWindows, ({ many }) => ({
  students: many(studentAvailabilityWindows),
}));

export const studentAvailabilityWindowsRelations = relations(studentAvailabilityWindows, ({ one }) => ({
  student: one(students, {
    fields: [studentAvailabilityWindows.student_id],
    references: [students.id],
  }),
  availabilityWindow: one(availabilityWindows, {
    fields: [studentAvailabilityWindows.availability_window_id],
    references: [availabilityWindows.id],
  }),
}));

export const teachersRelations = relations(teachers, ({ many }) => ({
  lessons: many(lessons),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  package: one(packages, {
    fields: [bookings.package_id],
    references: [packages.id],
  }),
  student: one(students, {
    fields: [bookings.student_id],
    references: [students.id],
  }),
  lessons: many(lessons),
}));

export const sessionsRelations = relations(sessions, ({ many }) => ({
  lessons: many(lessonSessions),
  // Removed individual equipment relations as we're now using an array
}));

export const paymentsRelations = relations(payments, ({ many }) => ({
  lessons: many(lessons),
}));

export const postLessonsRelations = relations(postLessons, ({ many }) => ({
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [lessons.teacher_id],
    references: [teachers.id],
  }),
  booking: one(bookings, {
    fields: [lessons.booking_id],
    references: [bookings.id],
  }),
  payment: one(payments, {
    fields: [lessons.payment_id],
    references: [payments.id],
  }),
  postLesson: one(postLessons, {
    fields: [lessons.post_lesson_id],
    references: [postLessons.id],
  }),
  sessions: many(lessonSessions),
}));

export const lessonSessionsRelations = relations(lessonSessions, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonSessions.lesson_id],
    references: [lessons.id],
  }),
  session: one(sessions, {
    fields: [lessonSessions.session_id],
    references: [sessions.id],
  }),
}));
