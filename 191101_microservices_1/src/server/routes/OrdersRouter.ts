import * as ioTs from 'io-ts';
import { Router } from 'express';
// import { ORDER_ROUTES } from '../../shared/domains/orders/ORDER_ROUTES';
import * as either from 'fp-ts/lib/Either';
import * as tEither from 'fp-ts/lib/TaskEither';
import * as pipeable from 'fp-ts/lib/pipeable';


// /**
//  * Register orders routes and use the router
//  */
// export function registerOrdersRoutes() {
//   const ordersRouter = Router();

//   ordersRouter

//     // index
//     .get(ORDER_ROUTES.INDEX.template, (req, res, next) => {

//     })

//     // get
//     .get(ORDER_ROUTES.GET.template, (req, res, next) => {

//     })

//     // create
//     .post(ORDER_ROUTES.CREATE.template, (req, res, next) => {
//       const result = pipeable.pipe(
//         ORDER_ROUTES.CREATE.req.decode(req),
//         either.chain(
//           (body) => { return either.right('abc' as const); },
//         ),
//       );
//     })

//     // update
//     .put(ORDER_ROUTES.UPDATE.template, (req, res, next) => {

//     })

//     // update
//     .patch(ORDER_ROUTES.UPDATE.template, (req, res, next) => {

//     }).

//     // delete
//     delete(ORDER_ROUTES.DELETE.template, (req, res, next) => {

//     });

//   return ordersRouter;
// }

export const todo = null;