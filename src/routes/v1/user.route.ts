import { Router } from 'express';
import { getProfile, getUserAccounts, linkAccount } from '../../controllers/v1/user.controller.js';
import { authenticate } from '../../middlewares/authentication.js';
// import { linkAccountValidationRule } from '../../validators/user.validator.js';
// import { checkRouteValidity } from '../../middlewares/validationMiddleware.js';

const userRouter = Router();
userRouter.get('/linked-accounts',authenticate,getUserAccounts);
userRouter.post('/link-account',authenticate,linkAccount);
userRouter.get('/profile',authenticate,getProfile);
export default userRouter;