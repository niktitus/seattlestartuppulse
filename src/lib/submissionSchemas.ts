import { z } from 'zod';

const httpUrl = z
  .string()
  .trim()
  .max(2000, { message: 'Link is too long' })
  .regex(/^https?:\/\/\S+$/i, { message: 'Must be a valid link starting with http:// or https://' });

export const optionalUrl = httpUrl.optional().or(z.literal(''));

export const email = z
  .string()
  .trim()
  .email({ message: 'Enter a valid email address' })
  .max(255, { message: 'Email must be under 255 characters' });

export const jobSubmissionSchema = z.object({
  submitter_email: email,
  submitter_name: z.string().trim().max(120).optional().or(z.literal('')),
  job_title: z.string().trim().min(2, { message: 'Job title is required' }).max(200),
  company_name: z.string().trim().min(1, { message: 'Company name is required' }).max(200),
  company_url: optionalUrl,
  company_address: z.string().trim().max(300).optional().or(z.literal('')),
  founder_name: z.string().trim().max(120).optional().or(z.literal('')),
  founder_linkedin: optionalUrl,
  application_url: httpUrl,
  description: z.string().trim().max(5000).optional().or(z.literal('')),
  salary_min: z.number().int().min(0).max(10_000_000).nullable(),
  salary_max: z.number().int().min(0).max(10_000_000).nullable(),
  equity_min: z.number().min(0).max(100).nullable(),
  equity_max: z.number().min(0).max(100).nullable(),
});

export const courseSubmissionSchema = z.object({
  submitter_email: email,
  submitter_name: z.string().trim().max(120).optional().or(z.literal('')),
  course_name: z.string().trim().min(2, { message: 'Course name is required' }).max(200),
  course_url: httpUrl,
  description: z.string().trim().max(5000).optional().or(z.literal('')),
  instructor_name: z.string().trim().min(1, { message: 'Instructor name is required' }).max(150),
  instructor_linkedin: optionalUrl,
  time_commitment: z.string().trim().max(100).optional().or(z.literal('')),
  price_amount: z.number().int().min(0).max(100_000_000).nullable(),
});

export const companySubmissionSchema = z.object({
  name: z.string().trim().min(1, { message: 'Company name is required' }).max(200),
  website: httpUrl.max(500),
  purpose: z.string().trim().max(100),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
});

export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5, { message: 'Please rate the event 1–5' }),
  most_valuable_part: z
    .string()
    .trim()
    .min(1, { message: 'Please select the part that delivered the most value' }),
  wish_more: z.string().trim().max(1000).nullable(),
  attend_again: z.boolean({ required_error: 'Please let us know if you would attend again' }),
});

/** Returns the first validation message, or null when valid. */
export function firstError(result: z.SafeParseReturnType<unknown, unknown>): string | null {
  if (result.success) return null;
  return result.error.errors[0]?.message ?? 'Please check the form and try again.';
}