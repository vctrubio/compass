import { z } from "zod";
import { availableLanguages } from "./languages"; // Import available languages

// Create a Zod schema for teacher validation
export const teacherSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }).optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  languages: z.array(z.enum(availableLanguages)).min(1, { message: "At least one language is required" })
});

// Define the Teacher type from the schema
export type Teacher = z.infer<typeof teacherSchema>;

// Default teacher object
export const defaultTeacher: Teacher = {
  name: "",
  email: "",
  phone: "",
  languages: []
};
