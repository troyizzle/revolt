import { z } from "zod";

export const createSeasonSchema = z.object({
  name: z.string({
    required_error: "Season name is required",
  }).min(3).max(60),
  startDate: z.date(),
  endDate: z.date().optional(),
  leagueId: z.string()
})

export type CreateSeasonSchema = z.infer<typeof createSeasonSchema>

export const updateSeasonSchema = createSeasonSchema.extend({
  id: z.string()
})

export type UpdateSeasonSchema = z.infer<typeof updateSeasonSchema>
