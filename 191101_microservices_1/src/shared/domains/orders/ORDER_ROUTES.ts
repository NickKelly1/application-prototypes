// import * as ioTs from 'io-ts';
// import { ORDER_COMMANDS } from './ORDER_COMMANDS';
// import { ORDER_CODEC } from './ORDER_CODEC';

// export const ORDER_ROUTES = {
//   INDEX: {
//     method: 'GET',
//     template: '/orders' as const,
//     build() { return '/orders' },
//     req: null,
//     res: ioTs.type({
//       data: ioTs.array(ORDER_CODEC),
//       meta: ioTs.type({ })
//     }),
//   },
//   GET: {
//     method: 'GET',
//     template: '/orders/:orderId' as const,
//     build({ orderId }: { orderId: string }) { return this.template.replace(':orderId', orderId); },
//     req: null,
//     res: ioTs.type({
//       data: ORDER_CODEC,
//       meta: ioTs.type({ }),
//     })
//   },
//   CREATE: {
//     method: 'POST',
//     template: '/orders' as const,
//     build: () => '/orders',
//     req: ORDER_COMMANDS.CODEC.CREATE_ORDER,
//     res: ioTs.type({
//       data: ORDER_CODEC,
//       meta: ioTs.type({ eventId: ioTs.string, eventSourceId: ioTs.string }),
//     })
//   },
//   UPDATE: {
//     method: ['PUT', 'PATCH'],
//     template: '/orders' as const,
//     req: ORDER_COMMANDS.CODEC.UPDATE_ORDER,
//     build({ orderId }: { orderId: string }) { return this.template.replace(':orderId', orderId); },
//     res: ioTs.type({
//       data: ORDER_CODEC,
//       meta: ioTs.type({ eventId: ioTs.string, eventSourceId: ioTs.string }),
//     })
//   },
//   DELETE: {
//     method: 'DELETE',
//     template: '/orders/:orderId' as const,
//     req: null,
//     build({ orderId }: { orderId: string }) { return this.template.replace(':orderId', orderId); },
//     res: ioTs.type({
//       data: ioTs.type({ id: ioTs.string }),
//       meta: ioTs.type({ eventId: ioTs.string, eventSourceId: ioTs.string }),
//     })
//   },
// }

export const todo = null;