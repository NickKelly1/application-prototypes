import express, { Router } from 'express';
import { UserEntityController } from '../controllers/user-entity-controller';
import { CreateUserEntityRequest } from '../requests/users/create-user-entity-request';

export class UserEntityRouter {
  private controller: UserEntityController;

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
   */
  private index = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await this.controller.index();
    res.status(200).json(response);
    next();
  };

  /**
   * @description
   * Get single
   */
  private get = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { user_id } = req.params;

    const userId = parseInt(user_id, 10);

    if (Number.isFinite(userId)) {
      const response = await this.controller.get(userId);
      res.status(200).json(response);
    } else {
      res.status(422).json({ error: 'invalid params' });
    }

    next();
  };

  /**
   * @description
   * Post single
   */
  private post = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const createRequest = new CreateUserEntityRequest();

    const response = await this.controller.create(createRequest);

    res.status(201).json(response);
    next();
  };

  /**
   * @description
   * Update single (with all fields)
   */
  private put = async (req: express.Request, res: express.Response, next: express.NextFunction) => {};

  /**
   * @description
   * Update single (with partial of fields)
   */
  private patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {};

  /**
   * @description
   * Delete single
   */
  private delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {};
}

export const userRouter = Router({ caseSensitive: true, strict: true });

userRouter.get('/users/', () => {});
