import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const { error } = config();

  if (error) throw error;
}

const port: number = process.env.PORT ? +process.env.PORT : 8080;

export { port };
