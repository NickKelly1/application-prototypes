// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as ts from 'typescript';
import { AppExpressRequest } from './AppExpressRequest';
// https://stackoverflow.com/questions/45194598/using-process-env-in-typescript

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      USER_SERVICE_ADMIN_USERNAME: string;
      USER_SERVICE_ADMIN_PASSWORD: string;

      USER_SERVICE_INTERNAL_PORT: string;

      NODE_ENV: string;

      USER_SERVICE_MONGODB_HOST: string;
      USER_SERVICE_MONGODB_PORT: string;

      USER_SERVICE_MONGODB_USER: string;
      USER_SERVICE_MONGODB_PASSWORD: string;

      SLEEP: string;

      ROOT_DIR: string;
      EXT_NAME: string;

      JWT: string;
    }
  }

  // Modifying the express request
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Request extends AppExpressRequest {}
  }

  // namespace http {
  //   // eslint-disable-next-line @typescript-eslint/no-empty-interface
  //   interface IncomingMessage extends AppIncomingMessage {}
  // }
}