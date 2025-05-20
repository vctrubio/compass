import { z } from "zod";

// Create a Zod schema for session validation
export const sessionSchema = z.object({
  id: z.number().optional(),
  equipment_ids: z.array(z.number()).min(1, { message: "At least one equipment item is required" }),
  start_time: z.string().min(1, { message: "Start time is required" }),
  duration: z.number().int().positive({ message: "Duration is required and must be positive" }),
});

// Define the Session type from the schema
export type Session = z.infer<typeof sessionSchema>;

// Default session object
export const defaultSession: Session = {
  equipment_ids: [],
  start_time: new Date().toISOString().slice(0, 16), // Format as YYYY-MM-DDThh:mm
  duration: 60, // Default duration in minutes
};
