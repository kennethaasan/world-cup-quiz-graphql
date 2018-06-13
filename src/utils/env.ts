import dotenv from 'dotenv';

dotenv.config();

export function getEnviromentVariable(enviromentVariable: string): string {
  const envVar = process.env[enviromentVariable];

  if (!envVar || typeof envVar !== 'string') {
    throw new Error(`enviroment variable ${enviromentVariable} is required`);
  }

  return envVar;
}
