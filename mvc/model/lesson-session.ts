import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { lessons } from "./lesson";
import { sessions } from "./session";

export const lessonSessions = pgTable("lesson_sessions", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  sessionId: integer("session_id").notNull().references(() => sessions.id),
});

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