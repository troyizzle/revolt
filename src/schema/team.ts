import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string({
    required_error: "Team name is required",
  }).min(1).max(50),
  points: z.number({
    required_error: "Team points is required",
  }).int().min(0).max(1000),
  users: z.number()
})

export type CreateTeamInput = z.infer<typeof createTeamSchema>;

