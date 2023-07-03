import { z } from "zod";

export const createLeagueSchema = z.object({
  name: z.string({
    required_error: "League name is required",
  }).min(3).max(60)
})

export type CreateLeagueSchema = z.infer<typeof createLeagueSchema>

export const updateLeagueSchema = createLeagueSchema.extend({
  id: z.string()
})

export type UpdateLeagueSchema = z.infer<typeof updateLeagueSchema>
