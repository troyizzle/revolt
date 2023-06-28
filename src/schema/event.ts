import { z } from "zod";

export const createEventSchema = z.object({
  date: z.date(),
  track: z.string(),
  laps: z.number().int().positive(),
  ip: z.string().ip(),
  serverStatus: z.string(),
  resultsUrl: z.string().url().optional(),
})

export type CreateEventSchema = z.infer<typeof createEventSchema>

export const scheduleEventSchema = z.object({
  scheduledDate: z.string(),
  createdById: z.string().optional(),
})

export type ScheduleEventSchema = z.infer<typeof scheduleEventSchema>

// TODO: Extend scheduileEventSchema ?
export const updateEventSchema = createEventSchema.extend({
  id: z.string(),
  scheduledDate: z.string().optional(),
  createdById: z.string().optional(),
})

export type UpdateEventSchema = z.infer<typeof updateEventSchema>

