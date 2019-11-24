import { Router } from 'express';
import { userRoutes } from '../resources/user/user.routes';

export const apiRoutes = Router();

apiRoutes.use('/users', userRoutes);
