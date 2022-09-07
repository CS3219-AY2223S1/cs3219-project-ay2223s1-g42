import { z } from "nestjs-zod/z";

const EnvSchema = z.object({
  PORT: z.number().default(5000),
  DATABASE_URL: z
    .string()
    .default(
      "postgresql://postgres:postgres@localhost:5434/nest?schema=public"
    ),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
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
