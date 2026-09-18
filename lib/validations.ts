import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().trim().min(2, { message: "Please enter your full name (at least 2 characters)" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  whatsapp: z
    .string()
    .trim()
    .min(7, { message: "Please enter your WhatsApp number (at least 7 digits)" })
    .max(20, { message: "Phone number is too long" })
    .regex(/^[+]?[\d\s\-()]{7,20}$/, {
      message: "Please enter a valid WhatsApp number (e.g., +234 801 234 5678)",
    }),
  role: z.string().trim().min(2, { message: "Please specify your role (e.g., Designer, Developer, Creator)" }),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const volunteerSchema = z.object({
  name: z.string().trim().min(2, { message: "Please enter your full name (at least 2 characters)" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  whatsapp: z
    .string()
    .trim()
    .min(7, { message: "Please enter your WhatsApp number (at least 7 digits)" })
    .max(20, { message: "Phone number is too long" })
    .regex(/^[+]?[\d\s\-()]{7,20}$/, {
      message: "Please enter a valid WhatsApp number (e.g., +234 801 234 5678)",
    }),
  role: z.string().trim().min(2, { message: "Please specify your role (e.g., Designer, Developer, Creator)" }),
  motivation: z.string().trim().max(500, { message: "Motivation must be under 500 characters" }).optional(),
});

export type VolunteerFormValues = z.infer<typeof volunteerSchema>;
