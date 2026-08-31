import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().trim().min(2, { message: "Please enter your full name (at least 2 characters)" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  role: z.string().trim().min(2, { message: "Please specify your role (e.g., Designer, Developer, Creator)" }),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
