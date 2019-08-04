import express, { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import { CreateUserRequest } from '../requests/users/create-user-request';
import { UpdateUserRequest } from '../requests/users/update-user-request';
import { HTTP_STATUS } from '../../constants/http-status';
import { isLeft } from 'fp-ts/lib/Either';
import { ValidationReporter } from '../../validation/helpers/validation-reporter';

/**
 * @description
 * get many
 *
 * @param req
 * @param res
 * @param next
 */
const index = (controller: UserController) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const response = await controller.index();
  res.status(HTTP_STATUS.GET).json(response);
  next();
};

/**
 * @description
 * Get single
 *
 * @param req
 * @param res
 * @param next
 */
const get = (controller: UserController) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { user_id } = req.params;

  const userId = parseInt(user_id, 10);

  if (isFinite(userId)) {
    const response = await controller.get(userId);
    res.status(HTTP_STATUS.GET).json(response);
  } else {
    res.status(HTTP_STATUS.INVALID).json({ error: 'invalid params' });
  }

  next();
};

/**
 * @description
 * Post single
 *
 * @param req
 * @param res
 * @param next
 */
const post = (controller: UserController) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  console.log('b', req.body);
  const createRequest = CreateUserRequest.validate(req.body);

  if (isLeft(createRequest)) {
    console.log('qweqwe', createRequest.left, ValidationReporter.report(createRequest));
    res.status(HTTP_STATUS.INVALID).json(ValidationReporter.report(createRequest));
  } else {
    const { status, response } = await controller.create(createRequest.right);
  }

  // const response = await controller.create(createRequest);

  // res.status(HTTP_STATUS.CREATED).json(response);
  // next();
};

/**
 * @description
 * Update single (with all fields)
 *
 * @param req
 * @param res
 * @param next
 */
const put = (controller: UserController) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const updateRequest = new UpdateUserRequest();

  const response = await controller.update(updateRequest);

  res.status(HTTP_STATUS.UPDATED).json(response);
  next();
};

/**
 * @description
 * Update single (with partial of fields)
 *
 * @param req
 * @param res
 * @param next
 */
const patch = (controller: UserController) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const updateRequest = new UpdateUserRequest();

  const response = await controller.update(updateRequest);

  res.status(HTTP_STATUS.UPDATED).json(response);
  next();
};

/**
 * @description
 * Delete single
 *
 * @param req
 * @param res
 * @param next
 */
const _delete = (controller: UserController) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { user_id } = req.params;

  const userId = parseInt(user_id, 10);

  if (isFinite(userId)) {
    const response = await controller.delete(userId);
    res.status(HTTP_STATUS.DELETED).json(response);
  } else {
    res.status(HTTP_STATUS.INVALID).json({ error: 'invalid params' });
  }

  next();
};

export const createUserRouter = () => {
  const router = Router({ caseSensitive: true, strict: true });
  const controller = new UserController();

  router.get('/users/', index(controller));
  router.get('/users/:user_id', get(controller));
  router.post('/users/', post(controller));
  router.put('/users/:user_id', put(controller));
  router.patch('/users/:user_id', patch(controller));
  router.delete('/users/:user_id', _delete(controller));

  return router;
};
