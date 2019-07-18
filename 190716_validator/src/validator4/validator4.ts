/**
 * Generate json-schema .json files from TypeScript Types
 *
 * @see https://www.npmjs.com/package/typescript-json-schema
 *
 * @description
 * This method uses the npm package, "typescript-json-schema", to generate json-schema's for
 * TypeScript Type Definitions.
 *
 *  1   -   It uses "TJS.getProgramFromFiles" to create a "program" that compiles .ts to TypeScript
 *
 *  2   -   After building the program, use the TJS library to create a "generator" that
 *          exposes an API to access program's Types ("Symbols") as JavaScript objects
 *
 *  3   -   With access to the Types ("Symbols") as JS objects, use Node's fs.writeFile
 *          to write the schemas to .json files
 */
import path from 'path';
import * as TJS from 'typescript-json-schema';
import { readdir, writeFile } from 'fs';

console.log('[RUNNING] validator4');

const basePath = path.resolve(__dirname);
const schemasPath = path.resolve(basePath, './schemas');
const typesPath = path.resolve(basePath, './types');

const tsconfigPath = path.resolve(__dirname, '../../tsconfig.json');

// optionally pass arguments to schema generator
const settings: TJS.PartialArgs = {
  required: true,
  // uniqueNames: true,
};
// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = { strictNullChecks: true };

(async () => {
  const fileNames: string[] = (await new Promise<string[]>((res, rej) =>
    readdir(typesPath, (err, fileNames) => (err ? rej(err) : res(fileNames))),
  )).filter(fileName => fileName.endsWith('.d.ts'));

  console.log('[FOUND] fileNames:', { fileNames });

  // getting schemas
  // const program = TJS.getProgramFromFiles(fileNames, compilerOptions, schemasPath);
  const typeFileMappings: {
    path: string;
    name: string;
    schemaFileIsCreated: boolean;
    outPath: string;
  }[] = fileNames.map(fileName => ({
    path: path.resolve(typesPath, fileName),
    outPath: path.resolve(schemasPath, fileName.replace('.d.ts', '')) + '.json',
    name: fileName.replace('.d.ts', ''),
    schemaFileIsCreated: false,
  }));

  console.log('[CREATED] typeFileMappings:', typeFileMappings);

  // go through each file in the directory
  await Promise.all(
    typeFileMappings.map(async typeFileMapping => {
      console.log('[PROCESSING:__] typeFileMapping:', typeFileMapping);
      const program = TJS.getProgramFromFiles([typeFileMapping.path], compilerOptions, schemasPath);
      console.log('[PROCESSING:SOURCE_FILES]');

      // get generator
      console.log(`[PROCESSING:GETTING_GENERATOR]: getting generator...`);
      const generator = TJS.buildGenerator(program, settings);
      if (!generator) {
        console.log('[PROCESSING:NULL_GENERATOR]', { generator });
        return;
      }
      console.log('[PROCESSING:GENERATOR_RECEIVED]');

      // get symbol
      // the "uniqueNames" setting generates a ".<shortId>" following the symbol name
      console.log(`[PROCESSING:GETTING_USER_SYMBOL]: getting symbol for: "${typeFileMapping.name}"...`);
      const symbols = generator.getUserSymbols();
      const fullSymbolIdentifier = symbols.find(symbol =>
        symbol.indexOf('.') !== -1
          ? symbol.substr(0, symbol.indexOf('.')).toLowerCase() === typeFileMapping.name.toLowerCase()
          : symbol.toLowerCase() === typeFileMapping.name.toLowerCase(),
      );
      if (!fullSymbolIdentifier) {
        console.log(`[PROCESSING:UNABLE_TO_FIND_SYMBOL]: Unable to find symbol for ${typeFileMapping.name}... exiting`);
        return;
      }
      const shortSymbolIdentifier =
        fullSymbolIdentifier.indexOf('.') !== -1
          ? fullSymbolIdentifier.substr(0, fullSymbolIdentifier.indexOf('.'))
          : fullSymbolIdentifier;
      console.log('[PROCESSING:FOUND_SYMBOL]', `${typeFileMapping.name}: `, { fullSymbolIdentifier, shortSymbolIdentifier });

      // get schema
      console.log(`[PROCESSING:GETTING_SCHEMA]: getting schema for symbol ${fullSymbolIdentifier}...`);
      const schema = generator.getSchemaForSymbol(fullSymbolIdentifier);
      if (!schema) {
        console.log(`[PROCESSING:NULL_SCHEMA]: Unable to create a schema for "${fullSymbolIdentifier}"`, { schema });
        return;
      }
      console.log(`[PROCESSING:CREATED_SCHEMA]: Created schema for "${fullSymbolIdentifier}"`, { schema });

      // write schema
      console.log(`[PROCESSING:WRITING_SCHEMA] writing json-schema file: "${typeFileMapping.outPath}"`);
      const writeResult = await new Promise((res, rej) =>
        writeFile(typeFileMapping.outPath, JSON.stringify(schema, null, 2), err => (err ? rej(err) : res(null))),
      );
      typeFileMapping.schemaFileIsCreated = true;
    }),
  );

  console.log('[FINISHED:...]');
  const successfulTypeFileMappings = typeFileMappings.filter(typeFileMap => typeFileMap.schemaFileIsCreated);
  const unsuccessfulTypeFileMappings = typeFileMappings.filter(typeFileMap => !typeFileMap.schemaFileIsCreated);
  if (successfulTypeFileMappings.length) {
    console.log(
      '[SUCCESSFULLY:CREATED]',
      successfulTypeFileMappings.map(typeFileMapping => typeFileMapping.name).join(', '),
    );
  }
  if (unsuccessfulTypeFileMappings.length) {
    console.log('[FAILED:TO_CREATE]', unsuccessfulTypeFileMappings.map(typeFileMapping => typeFileMapping.name).join(', '));
  }
  console.log('[...:EXITING]');

  // schemas.forEach(schema => {
  //   const program = TJS.getProgramFromFiles([path.resolve(typesPath, 'Employee.d.ts')], compilerOptions, schemasPath);
  //   const schema = TJS.generateSchema(program, 'Employee', settings);
  //   await
  // })
  // console.log('Schema created:', { schema });
})();
