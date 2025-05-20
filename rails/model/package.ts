import { z } from "zod";

// Create a Zod schema for package validation
export const packageSchema = z.object({
  price: z.number().int().positive({ message: "Price must be a positive number" }),
  hours: z.number().int().min(1, { message: "Hours must be at least 1" }),
  capacity: z.number().int().min(1, { message: "Capacity must be at least 1" }),
  description: z.string().optional().or(z.literal(""))
});

// Define the Package type from the schema
export type Package = z.infer<typeof packageSchema>;

// Default package object
export const defaultPackage: Package = {
  price: 40,
  hours: 1,
  capacity: 1,
  description: ""
};
