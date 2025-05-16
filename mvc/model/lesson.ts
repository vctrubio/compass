import { z } from 'zod';

const LessonSchema = z.object({
    id: z.number().int().positive(),
    bookingId: z.number().int().positive(),
    teacherId: z.number().int().positive(),
    startTime: z.date(),
    endTime: z.date(),
    status: z.enum(['created', 'confirmed', 'cancelled', 'completed']),
});

export type Lesson = z.infer<typeof LessonSchema>;
export { LessonSchema };