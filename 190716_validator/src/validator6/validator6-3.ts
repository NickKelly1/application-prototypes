import { Either, right, left } from 'fp-ts/lib/Either';
import * as ioTs from 'io-ts';

// USE https://github.com/gcanti/io-ts

const RIGHT_TAG = 'Right';
const LEFT_TAG = 'Left';

const isString = (s: unknown): Either<string, string> => (typeof s === 'string' ? right(s) : left('must be a string'));

const Product = ioTs.interface({
  id: ioTs.number,
  name: ioTs.string,
  quantity: ioTs.number,
  type: ioTs.union([ioTs.literal('FURNITURE'), ioTs.literal('BOOK')]),
});

const Products = ioTs.array(Product);

const getProducts = () => {
  const apiResponse = [
    {
      id: 1,
      name: 'Table',
      type: 'FURNITURE',
      quantity: 5,
    },
    {
      id: 2,
      name: 'The Lord of the Rings',
      type: 'BOOK',
      quantity: 10,
    },
  ];

  const result = Products.decode(apiResponse);

  if (result._tag === RIGHT_TAG) {
    console.log('right!', result.right);
  } else if (result._tag === LEFT_TAG) {
    console.log('left!', result.left);
  }

  // @ts-ignore
  return result.value;
};

console.log('result: ', getProducts());
console.log('...Finished');
