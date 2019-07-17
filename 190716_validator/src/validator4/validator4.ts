// https://www.npmjs.com/package/typescript-json-schema
import path from 'path';
import * as TJS from 'typescript-json-schema';
import { readdir, writeFile } from 'fs';

console.log('running validator4');

const basePath = path.resolve(__dirname);
const schemasPath = path.resolve(basePath, './schemas');
const typesPath = path.resolve(basePath, './types');

const tsconfigPath = path.resolve(__dirname, '../../tsconfig.json');

// optionally pass arguments to schema generator
const settings: TJS.PartialArgs = { required: true, uniqueNames: true };
// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = { strictNullChecks: true };

(async () => {
  const fileNames: string[] = await new Promise<string[]>((res, rej) =>
    readdir(typesPath, (err, fileNames) => (err ? rej(err) : res(fileNames))),
  );
  console.log('Found fileNames:', { fileNames });

  // getting schemas
  // const program = TJS.getProgramFromFiles(fileNames, compilerOptions, schemasPath);
  const typeFiles: { path: string; name: string; schemaFileIsCreated: boolean; outPath: string }[] = [];
  fileNames.forEach(fileName => {
    typeFiles.push({
      path: path.resolve(typesPath, fileName),
      outPath: path.resolve(schemasPath, fileName),
      name: fileName.replace(path.extname(fileName), ''),
      schemaFileIsCreated: false,
    });
  });

  await Promise.all(
    typeFiles.map(async typeFile => {
      const program = TJS.getProgramFromFiles([typeFile.path], compilerOptions, schemasPath);
      const schema = TJS.generateSchema(program, name, settings);
      // write file
      if (!schema) console.log('unable to generate schema for typeFile:', typeFile);
      else {
        const writeResult = await new Promise((res, rej) =>
          writeFile(typeFile.outPath, schema, err => (err ? rej(err) : res(null))),
        );
        typeFile.schemaFileIsCreated = true;
      }
      return;
    }),
  );

  console.log('complete...');

  // schemas.forEach(schema => {
  //   const program = TJS.getProgramFromFiles([path.resolve(typesPath, 'Employee.d.ts')], compilerOptions, schemasPath);
  //   const schema = TJS.generateSchema(program, 'Employee', settings);
  //   await
  // })
  // console.log('Schema created:', { schema });
})();
