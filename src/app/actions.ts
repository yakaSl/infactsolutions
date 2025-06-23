"use server";

import * as z from 'zod';

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
});

export async function submitContactForm(values: z.infer<typeof formSchema>) {
  try {
    // Here you would typically process the form data,
    // e.g., send an email, save to a database, etc.
    console.log("Form submission received:", values);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate a potential error for demonstration
    if (values.email.includes('error')) {
        throw new Error("Simulated server error.");
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting form:", error);
    return { success: false };
  }
}
