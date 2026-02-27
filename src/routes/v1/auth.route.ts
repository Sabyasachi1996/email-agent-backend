import { Router } from 'express';
import { login, refreshToken, logout,register } from '../../controllers/v1/auth.controller.js';
import { loginValidationRules, refreshValidationRules, logoutValidationRules, registerValidationRules } from '../../validators/auth.validator.js';
import { checkRouteValidity } from '../../middlewares/validationMiddleware.js';

const authRouter = Router();
authRouter.post('/register', registerValidationRules,checkRouteValidity,register);
//to login
authRouter.post('/login', loginValidationRules, checkRouteValidity, login);
//to refresh login token
authRouter.post('/refresh', refreshValidationRules, checkRouteValidity, refreshToken);
//to logout
authRouter.post('/logout', logoutValidationRules, checkRouteValidity, logout);
export default authRouter;