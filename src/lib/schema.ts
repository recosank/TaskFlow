import z from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1, "Enter your name"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 chars"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const TaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().min(1, "Due date required"),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
});
