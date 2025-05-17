import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { lessonSessions } from "./lesson-session";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  equipmentIds: integer("equipment_ids").array().notNull(), // Array of equipment IDs
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  duration: integer("duration").notNull(), // In minutes
});

export const sessionsRelations = relations(sessions, ({ many }) => ({
  lessons: many(lessonSessions),
}));