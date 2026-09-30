import { z } from "zod";
import { SUBJECTS } from "@/data/schemas";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name needs at least 2 characters").max(80),
  email: z.email("Enter a valid email").max(120),
  subject: z.enum(SUBJECTS),
  message: z.string().trim().min(20, "Tell me a bit more (20+ characters)").max(2000),
  website: z.string().max(500).optional().default(""), // honeypot: humans never see this field; the route fakes success when filled
});
export type ContactInput = z.infer<typeof contactSchema>;
export const CONTACT_ERROR = "Check the form: name (2+ characters), a valid email, and a message of 20–2000 characters.";
