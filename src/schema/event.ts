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
  scheduledDate: z.date(),
})

export type ScheduleEventSchema = z.infer<typeof scheduleEventSchema>
