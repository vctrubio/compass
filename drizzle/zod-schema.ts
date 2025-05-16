import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  students,
  teachers,
  availabilityWindows,
  equipment,
  packages,
  bookings,
  sessions,
  payments,
  postLessons,
  lessons,
} from "./schema";

// Base schemas
export const insertStudentSchema = createInsertSchema(students, {
  name: z.string().min(2, "Name is required, at least 2 characters... we're not Madonna here!"),
  age: z.number().int().min(4, "Age must be at least 4 years old. Even baby sharks are faster learners!"),
  languages: z.array(z.enum(["english", "spanish", "french", "german"])).min(1, "At least one language is required. We're not mind readers!"),
});

export const selectStudentSchema = createSelectSchema(students);

export const insertTeacherSchema = createInsertSchema(teachers, {
  name: z.string().min(2, "Name too short! Even 'Ed' has 2 characters."),
  languages: z.array(z.enum(["english", "spanish", "french", "german"])).min(1, "How are you going to teach without speaking? Morse code?"),
});

export const selectTeacherSchema = createSelectSchema(teachers);

export const insertAvailabilityWindowSchema = createInsertSchema(availabilityWindows, {
  startDate: z.string().or(z.date()).refine(date => new Date(date) > new Date(), 
    "Unless you have a time machine, you can't book in the past!"),
  endDate: z.string().or(z.date()).refine(date => new Date(date) > new Date(),
    "End date must be in the future... we're teaching kitesurfing, not history!"),
});

export const selectAvailabilityWindowSchema = createSelectSchema(availabilityWindows);

export const insertEquipmentSchema = createInsertSchema(equipment, {
  model: z.string().min(2, "Model name required. Even IKEA products have names!"),
  size: z.number().positive("Size must be positive. Negative size kites would suck you into the sky!"),
});

export const selectEquipmentSchema = createSelectSchema(equipment);

export const insertPackageSchema = createInsertSchema(packages, {
  price: z.number().int().positive("Free lessons? How generous! But our teachers need to eat."),
  hours: z.number().int().min(1, "Lessons shorter than 1 hour? What is this, speed dating?"),
  capacity: z.number().int().min(1, "Need at least 1 student. Teaching to ghosts isn't our specialty."),
});

export const selectPackageSchema = createSelectSchema(packages);

export const insertBookingSchema = createInsertSchema(bookings, {
  startDate: z.string().or(z.date()).refine(date => new Date(date) > new Date(),
    "Unless you're Doctor Who, you can't book in the past!"),
});

export const selectBookingSchema = createSelectSchema(bookings);

export const insertSessionSchema = createInsertSchema(sessions, {
  equipmentIds: z.array(z.number().int()).min(1, "Need equipment unless you plan to kitesurf with imagination only!"),
  duration: z.number().int().min(30, "Sessions under 30 minutes? Even my coffee break is longer!"),
});

export const selectSessionSchema = createSelectSchema(sessions);

export const insertPaymentSchema = createInsertSchema(payments, {
  amount: z.number().positive("We don't pay YOU to take lessons! Nice try though."),
});

export const selectPaymentSchema = createSelectSchema(payments);

export const insertPostLessonSchema = createInsertSchema(postLessons, {
  studentConfirmation: z.boolean().refine(val => val === true, 
    "Need confirmation the lesson happened. If it didn't, were you just dreaming about kitesurfing?"),
});

export const selectPostLessonSchema = createSelectSchema(postLessons);

export const insertLessonSchema = createInsertSchema(lessons, {
  status: z.enum(["created", "confirmed", "cancelled", "completed"])
    .default("created")
    .describe("Lesson status - 'cancelled' is not what we want to see!"),
});

export const selectLessonSchema = createSelectSchema(lessons);

// Type inference
export type NewStudent = z.infer<typeof insertStudentSchema>;
export type Student = z.infer<typeof selectStudentSchema>;

export type NewTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = z.infer<typeof selectTeacherSchema>;

export type NewAvailabilityWindow = z.infer<typeof insertAvailabilityWindowSchema>;
export type AvailabilityWindow = z.infer<typeof selectAvailabilityWindowSchema>;

export type NewEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = z.infer<typeof selectEquipmentSchema>;

export type NewPackage = z.infer<typeof insertPackageSchema>;
export type Package = z.infer<typeof selectPackageSchema>;

export type NewBooking = z.infer<typeof insertBookingSchema>;
export type Booking = z.infer<typeof selectBookingSchema>;

export type NewSession = z.infer<typeof insertSessionSchema>;
export type Session = z.infer<typeof selectSessionSchema>;

export type NewPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = z.infer<typeof selectPaymentSchema>;

export type NewPostLesson = z.infer<typeof insertPostLessonSchema>;
export type PostLesson = z.infer<typeof selectPostLessonSchema>;

export type NewLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = z.infer<typeof selectLessonSchema>;
