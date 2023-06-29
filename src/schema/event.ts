import { z } from "zod";

export const updateEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
})

export type UpdateEventInput = z.infer<typeof updateEventSchema>
