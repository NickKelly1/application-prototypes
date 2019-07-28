import express, { Router } from 'express';
import { UserEntityController } from '../controllers/user-entity-controller';
import { CreateUserEntityRequest } from '../requests/users/create-user-entity-request';
import { UpdateUserEntityRequest } from '../requests/users/update-user-entity-request';
import { HTTP_STATUS } from '../../constants/http-status';

export class UserEntityRouter {
  private controller: UserEntityController;

  /**
   * @constructor
   *
   * @param expressApp
   * @param controller
   */
  public constructor(expressApp: express.Express, controller: UserEntityController) {
    const router = Router({ caseSensitive: true, strict: true });

    this.controller = controller;

    router.get('/users/', this.index);
    router.get('/users/:user_id', this.get);
    router.post('/users/', this.post);
    router.put('/users/:user_id', this.put);
    router.patch('/users/:user_id', this.patch);
    router.delete('/users/:user_id', this.delete);

    expressApp.use(router);
  }

  /**
   * @description
   * get many
   *
   * @param req
   * @param res
   * @param next
   */
  private index = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await this.controller.index();
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
  private get = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { user_id } = req.params;

    const userId = parseInt(user_id, 10);

    if (isFinite(userId)) {
      const response = await this.controller.get(userId);
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
  private post = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const createRequest = new CreateUserEntityRequest();

    const response = await this.controller.create(createRequest);

    res.status(HTTP_STATUS.CREATED).json(response);
    next();
  };

  /**
   * @description
   * Update single (with all fields)
   *
   * @param req
   * @param res
   * @param next
   */
  private put = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const updateRequest = new UpdateUserEntityRequest();

    const response = await this.controller.update(updateRequest);

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
  private patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const updateRequest = new UpdateUserEntityRequest();

    const response = await this.controller.update(updateRequest);

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
  private delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { user_id } = req.params;

    const userId = parseInt(user_id, 10);

    if (isFinite(userId)) {
      const response = await this.controller.delete(userId);
      res.status(HTTP_STATUS.DELETED).json(response);
    } else {
      res.status(HTTP_STATUS.INVALID).json({ error: 'invalid params' });
    }

    next();
  };
}
