// (19-02-12) Interoperability with non functional code using fp-ts
// @see https://dev.to/gcanti/interoperability-with-non-functional-code-using-fp-ts-432e

import { Option, none, some } from 'fp-ts/lib/Option';

/**
 * @description
 * Find an index of an array in a functional way
 *
 * @param as
 * @param predicate
 */
function findIndex<A>(as: A[], predicate: (a: A) => boolean): Option<number> {
  const index = as.findIndex(predicate);
  return index === -1 ? none : some(index);
}

const myArray = [1, 2, 3];
const y = findIndex(myArray, x => x === 1);
if (y._tag === 'None') console.log('unable to find');
else console.log('successfully found:', y.value);
