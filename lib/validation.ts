import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const taskSchema = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    status: z.enum(["pending", "in-progress", "completed"])
});