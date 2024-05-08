import { z } from "zod";

export const SignupSchema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().min(1).email(),
    password: z.string().min(1)
})

export const SigninSchema = z.object({
    email: z.string().min(1).email(),
    password: z.string().min(1)
})
 