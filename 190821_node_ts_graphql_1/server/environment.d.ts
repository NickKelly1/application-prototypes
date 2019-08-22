// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as ts from 'typescript';
// https://stackoverflow.com/questions/45194598/using-process-env-in-typescript

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_SERVER_INTERNAL_PORT: number;
      POSTGRES_PORT: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_DB_NAME: string;
    }
  }
}