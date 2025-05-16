import { z } from 'zod';

const TeacherSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(2, "Name is required, at least 2 characters"),
    languages: z.array(z.string()).min(1, "At least one language is required"),
});

export type Teacher = z.infer<typeof TeacherSchema>;
export { TeacherSchema };