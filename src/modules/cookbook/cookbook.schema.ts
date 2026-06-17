import { z } from "zod";
export const AuthSchema = z.object({
  body: z.object({
    username: z
      .string({ message: "Username is required" })
      .min(3, "Username must be at least 8 characters long")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters long"),
  }),
});

export const CheckUsernameSchema = z.object({
  query: z.object({
    username: z.string({ message: "Username query parameter is required" }),
  }),
});
