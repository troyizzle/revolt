import { z } from "zod";

export const userUpdateSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  isAdmin: z.boolean().default(false).optional(),
})

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>
