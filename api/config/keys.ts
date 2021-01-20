import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const { error } = config();

  if (error) throw error;
}

const port: number = process.env.PORT ? +process.env.PORT : 8080;
<<<<<<< HEAD
const dbUrl: string =
  process.env.DB_URL || "mongodb://localhost:27017/syllabase";

export { port, dbUrl };
=======

export { port };
>>>>>>> main
