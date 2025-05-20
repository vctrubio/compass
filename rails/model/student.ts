import { z } from "zod";
import { availableLanguages } from "./languages"; // Import available languages

// Create a Zod schema for student validation
export const studentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }).optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  languages: z.array(z.enum(availableLanguages)).min(1, { message: "At least one language is required" }),
  age: z.number().int().positive({ message: "Age must be a positive number" }),
});

// Define the Student type from the schema
export type Student = z.infer<typeof studentSchema>;

// Default student object
export const defaultStudent: Student = {
  name: "",
  email: "",
  phone: "",
  languages: [],
  age: 18,
};
