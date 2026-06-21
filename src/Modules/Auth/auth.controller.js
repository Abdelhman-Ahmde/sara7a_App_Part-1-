import { Router } from "express";
import * as authService from "./auth.service.js";
import { authenticationAccess, authenticationRefresh } from "../../Middlewares/auth.middleware.js";
import { tokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as authValidation from "./auth.validation.js";

const router = Router();
router.post("/signup", validationMiddleware(authValidation.signupSchema), authService.signup);
router.post("/login", validationMiddleware(authValidation.loginSchema), authService.login);
router.post("/refresh-token", authenticationRefresh({ tokenType: tokenTypeEnum.Refresh }), authService.refreshToken);
router.post("/google-login", authService.googleLogin);
router.post("/logout", authenticationAccess(tokenTypeEnum.Access), authService.logout);
router.post("/logout-redis", authenticationAccess(tokenTypeEnum.Access), authService.logoutRedis);

export default router;
