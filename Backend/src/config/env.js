import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT ? Number(process.env.PORT) : 5001,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
};

