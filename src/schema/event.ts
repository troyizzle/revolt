import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string({
    required_error: "Event name is required",
  }).min(3).max(60),
  shortName: z.string({
    required_error: "Event short name is required",
  }).min(3).max(60),
  order: z.number(),
  seasonId: z.string({
    required_error: "Season is required",
  }),
})

export type CreateEventInput = z.infer<typeof createEventSchema>

export const updateEventSchema = createEventSchema.extend({
  id: z.string(),
})

export type UpdateEventInput = z.infer<typeof updateEventSchema>
