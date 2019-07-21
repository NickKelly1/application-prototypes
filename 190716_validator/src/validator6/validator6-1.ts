import * as ioTs from 'io-ts';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';

console.log('Running...');

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
      id: '2',
      name: 'The Lord of the Rings',
      type: 'BOOK',
      quantity: 10,
    },
  ];

  const result = Products.decode(apiResponse);

  // Throws:
  //  Error: Invalid value "2" supplied to : Array<{ id: number, name: string, quantity: number, type: ("FURNITURE" | "BOOK") }>/1:
  //  { id: number, name: string, quantity: number, type: ("FURNITURE" | "BOOK") }/id: number
  // ThrowReporter.report(result);

  if (result._tag === 'Right') {
    result.right;
  } else {
    result.left;
  }

  // @ts-ignore
  return result.value;
};

console.log(getProducts());
console.log('...Finished');
