import { writeFileSync } from 'fs';
import { compileFromFile } from 'json-schema-to-typescript';
import { resolve } from 'path';

console.log(resolve(__dirname, '/client-log-in-request.d.ts'));

console.log(resolve(__dirname, '/client-log-in-request.json'));

/**
 * @description
 * Generates .d.ts files from JSON files
 *
 * https://spin.atomicobject.com/2018/03/26/typescript-data-validation/
 * https://github.com/bcherny/json-schema-to-typescript
 */
const generate = async () => {
  writeFileSync(
    resolve(__dirname, './incoming-socket-request-definitions/client-log-in-request.d.ts'),
    await compileFromFile(resolve(__dirname, './incoming-socket-request-definitions/client-log-in-request.json')),
  );
};

generate();
