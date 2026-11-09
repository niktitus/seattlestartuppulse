import { z } from "zod";

export const WIT_STAGES = ["student", "startup", "corporate", "transition"] as const;
export const WIT_INVOLVEMENT = ["host_space", "speak", "organize", "sponsor", "attend"] as const;

export const witSignupSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  stage: z.enum(WIT_STAGES, { errorMap: () => ({ message: "Pick where you are today" }) }),
  involvement: z.array(z.enum(WIT_INVOLVEMENT)),
  note: z.string().trim().max(1000).optional(),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please agree before submitting",
  }),
});
