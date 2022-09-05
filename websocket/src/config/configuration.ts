export const configuration = () => ({
  PORT: (parseInt(process.env.PORT, 10) as number) || 5555,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
});
