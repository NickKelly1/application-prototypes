import {pick, omit, pickFrom, omitFrom} from '@syntaxfanatics/peon';
import { pipe } from 'fp-ts/lib/pipeable';
import * as either from 'fp-ts/lib/Either';
import * as tEither from 'fp-ts/lib/TaskEither';
import { Router } from 'express';
import { UserModel, userAttributes } from './user.model';
import { RequestFail, sendSuccess, sendFail, mapFail, map422, map500 } from '../../shared/ts/helpers/route.helper';
import { createUserRequestValidator } from './user.requests';
import { normaliseValidationErrors } from '../../shared/ts/helpers/create-validator.helper';
import { HTTP_STATUS } from '../../shared/ts/constants/HTTP_STATUS.constant';


export const userRoutes = Router();



/**
 * Find a single user
 *
 * @param options
 */
function findUser(options: { id: string }) {
  return async function doFindUser() {
    const user = await UserModel.findOne(options).exec();
    if (!user) return either.left({ message: `Unable to find user "${options.id}"`, code: HTTP_STATUS.NOT_FOUND, data: {} } as RequestFail);
    return either.right(user);
  }
}



/**
 * Find many users
 */
function findUsers() {
  return async function doFindUsers() {
    const users = await UserModel.find();
    if (!users) return either.left(mapFail( HTTP_STATUS.NOT_FOUND, 'Unable to find users')());
    return either.right(users);
  }
}




/* Get many users */
userRoutes.get(
  '/',
  (req, res, next) => {
    pipe(
      findUsers(),
      tEither.map(users => users
        .map(user => pickFrom(user)(...userAttributes))
        .map(user => omitFrom(user)('password')),
      ),
      tEither.map(users => sendSuccess(req, res, HTTP_STATUS.GET)(users)),
      tEither.mapLeft(fail => sendFail(req, res)(fail)),
    )().catch(next);
  },
);



/* GET a single user. */
userRoutes.get(
  '/:userId',
  (req, res, next) => {
    pipe(
      findUser(pipe(
        pickFrom(req.params)('userId'),
        ({ userId, ...args }) => ({ ...args, id: userId })
      )),
      tEither.map(user => pickFrom(user)(...userAttributes)),
      tEither.map(user => omitFrom(user)('password')),
      tEither.map(user => sendSuccess(req, res, HTTP_STATUS.GET)(user)),
      tEither.mapLeft(fail => sendFail(req, res)(fail))
    )().catch(next);
  },
);



userRoutes.post(
  '/',
  (req, res, next) => {
    console.log(req.body, req.params);
    pipe(
      tEither.fromEither(createUserRequestValidator(req.body)),
      tEither.mapLeft(fail => normaliseValidationErrors(fail)),
      tEither.mapLeft(fail => map422('Failed to validate user')(fail)),
      tEither.map(validatedBody => new UserModel(validatedBody)),
      tEither.map((user) => tEither.tryCatch(
        user.save.bind(user),
        map500(),
      )),
      tEither.flatten,
      tEither.map(user => pickFrom(user)(...userAttributes)),
      tEither.map(user => omitFrom(user)('password')),
      tEither.map(user => sendSuccess(req, res, HTTP_STATUS.CREATED)(user)),
      tEither.mapLeft(fail => sendFail(req, res)(fail)),
    )().catch(next);
  },
);
