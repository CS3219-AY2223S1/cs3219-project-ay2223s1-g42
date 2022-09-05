import { z } from 'nestjs-zod/z';

const EnvSchema = z.object({
  PORT: z.number().default(5555),
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
  SUPABASE_JWT_SECRET: z.string(),
});

export function validate(config: Record<string, unknown>) {
  const { PORT, ...rest } = config;
  // convert PORT env variable to number before
  // parsing thru zod schema
  const parsedEnv = EnvSchema.parse({
    PORT: parseInt(PORT as string),
    ...rest,
  });
  return parsedEnv;
}
