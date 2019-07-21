import * as t from 'io-ts';

// https://www.npmjs.com/package/io-ts
// https://gcanti.github.io/io-ts/
// https://github.com/gcanti/fp-ts
// https://spin.atomicobject.com/2018/03/26/typescript-data-validation/


const isString = (u: unknown): u is string => typeof u === 'string';

const string = new t.Type<string, string, unknown>(
  'string',
  isString,
  (u, c: t.Context) => (isString(u) ? t.success(u) : t.failure(u, c)),
  t.identity,
);

const z: unknown;

if (isString(z)) {
  z;
}

const User = t.type({
  userId: t.number,
  name: t.string,
});

// validation succeeded
User.decode(JSON.parse('{"userId":1,"name":"Guilio"}')); // => Right({ userId: 1, name: Guilio });

// validation failed
User.decode(JSON.parse('{"name":"Guilio"}')); // => Left([...])

interface Reporter<A> {
  report: (validation: t.Validation<any>) => A;
}

User.props.
