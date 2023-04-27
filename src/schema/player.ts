import { z } from "zod";

export const createPlayerSchema = z.object({
  name: z.string({
    required_error: "Player name is required",
  }).min(1).max(50),
})

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
