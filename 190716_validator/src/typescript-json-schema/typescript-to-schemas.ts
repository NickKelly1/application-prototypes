// https://www.npmjs.com/package/typescript-json-schema

import { resolve } from 'path';

import * as TJS from 'typescript-json-schema';

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
};

// optionally pass a base path
const basePath = resolve(__dirname, './types');

const program = TJS.getProgramFromFiles([resolve(__dirname, './my-type.d.ts')], compilerOptions, basePath);

// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, 'MyType', settings);

// ... or a generator that lets us incrementally get more schemas
const generator = TJS.buildGenerator(program, settings);

if (generator) {
  // all symbols
  const symbols = generator.getUserSymbols();

  // Get symbols for different types from generator.
  generator.getSchemaForSymbol('MyType');
  // generator.getSchemaForSymbol('AnotherType');
} else {
  console.log('warning - no generator', schema);
}
