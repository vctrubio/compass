import { z } from "zod";
import { LessonSchema } from "./lesson";


const StudentSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2, "Name is required, at least 2 characters"),
  age: z.number().int().min(4, "Age must be at least 4 years old. Common."),
  languages: z.array(z.string()).min(1, "At least one language is required"),
});

// Extend StudentSchema for fetching with lessons
const StudentFetchSchema = StudentSchema.extend({
  lessons: z.array(LessonSchema).default([]), // Default to empty array
  // teachers: z.array(z.string()).default([]), // Default to empty array
});

// This means StudentFetchSchema has:
// - id (from StudentSchema)
// - name (from StudentSchema)
// - age (from StudentSchema)
// - languages (from StudentSchema)
// - lessons (added via extend)

type Student = z.infer<typeof StudentSchema>;
type StudentFetch = z.infer<typeof StudentFetchSchema>;

export type { Student, StudentFetch };
