import * as ioTs from 'io-ts';
import Joi from '@hapi/joi';
import { IUserAttributes } from './user.model';
import { createValidator } from '../../shared/ts/helpers/create-validator.helper';



const CreateUserRequestSchema = Joi.object({
  // email: Joi.string().max(50).email().required(),
  firstName: Joi.string().max(50).min(3).required(),
  lastName: Joi.string().max(50).required(),
  password: Joi.string().max(50).required(),
  // setting: Joi.object({
  //   theme: Joi.string().required(),
  //   notifications: Joi.string().required(),
  //   compactMode: Joi.string().required(),
  // }).required(),
}).strict();



export interface CreateUserRequest {
  email: IUserAttributes['email'];
  firstName: IUserAttributes['firstName'];
  lastName: IUserAttributes['lastName'];
  password: IUserAttributes['password'];
}



export const createUserRequestValidator = createValidator<CreateUserRequest>(CreateUserRequestSchema);
