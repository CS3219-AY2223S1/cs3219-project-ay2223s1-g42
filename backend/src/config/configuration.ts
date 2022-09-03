export const configuration = () => ({
  PORT: (parseInt(process.env.PORT, 10) as number) || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
});
