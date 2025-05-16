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

const equipmentTypeEnum = pgEnum("equipment_type", [
  "kite",
  "bar",
  "board",
]);

// Date spans table to track availability
export const availabilityWindows = pgTable("availability_windows", {
  id: serial("id").primaryKey(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  studentId: integer("student_id").notNull().references(() => students.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Profile tables: students, teachers, admins
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),  // Changed from fullName to name
  email: text("email"),
  phone: text("phone"),
  languages: languagesEnum("languages").array().notNull(),
  age: integer("age").notNull(),
  userId: text("user_id"), // For auth system integration
});

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),  // Changed from fullName to name
  email: text("email"),
  phone: text("phone"),
  languages: languagesEnum("languages").array().notNull(),
  userId: text("user_id"), // For auth system integration
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
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
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Bookings table - now directly links to a student
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id").notNull().references(() => packages.id),
  studentId: integer("student_id").notNull().references(() => students.id),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  comments: text("comments"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Equipment session table
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  equipmentIds: integer("equipment_ids").array().notNull(), // Array of equipment IDs
  startTime: timestamp("start_time", { withTimezone: true }).notNull(), // Changed from date to startTime
  duration: integer("duration").notNull(), // In minutes
});

// Payment table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  cash: boolean("cash").notNull(), // If false, it's a bank transfer
  createdDate: timestamp("created_date", { withTimezone: true }).notNull(), // Changed from date to createdDate
  amount: integer("amount").notNull(), // In euros
});

// Post lesson feedback table - simplified
export const postLessons = pgTable("post_lessons", {
  id: serial("id").primaryKey(),
  studentConfirmation: boolean("student_confirmation").notNull(),
});

// Lesson table - combines everything
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => teachers.id),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  paymentId: integer("payment_id").references(() => payments.id),
  postLessonId: integer("post_lesson_id").references(() => postLessons.id),
  status: statusEnum("status").notNull().default("created"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Lesson to session many-to-many relation table
export const lessonSessions = pgTable("lesson_sessions", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  sessionId: integer("session_id").notNull().references(() => sessions.id),
});

// Define relationships
export const studentsRelations = relations(students, ({ many }) => ({
  availabilityWindows: many(availabilityWindows),
  bookings: many(bookings), // Direct relation to bookings
}));

export const availabilityWindowsRelations = relations(availabilityWindows, ({ one }) => ({
  student: one(students, {
    fields: [availabilityWindows.studentId],
    references: [students.id],
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
    fields: [bookings.packageId],
    references: [packages.id],
  }),
  student: one(students, {
    fields: [bookings.studentId],
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
    fields: [lessons.teacherId],
    references: [teachers.id],
  }),
  booking: one(bookings, {
    fields: [lessons.bookingId],
    references: [bookings.id],
  }),
  payment: one(payments, {
    fields: [lessons.paymentId],
    references: [payments.id],
  }),
  postLesson: one(postLessons, {
    fields: [lessons.postLessonId],
    references: [postLessons.id],
  }),
  sessions: many(lessonSessions),
}));

export const lessonSessionsRelations = relations(lessonSessions, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonSessions.lessonId],
    references: [lessons.id],
  }),
  session: one(sessions, {
    fields: [lessonSessions.sessionId],
    references: [sessions.id],
  }),
}));
