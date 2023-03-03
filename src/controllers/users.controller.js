import { Router } from "express";
import loginSchema from "../helpers/schemas/login.schema.js";
import registerSchema from "../helpers/schemas/register.schema.js";
import * as AuthService from "../services/users/index.js";
import JoiMiddleware from "../helpers/middlewares/joiMiddleware.js";
import authenticateWithJWT from "../helpers/functions/authenticateWithJWT.js";
const authRouter = Router();


authRouter.post("/login", JoiMiddleware(loginSchema), AuthService.login);
authRouter.post(
  "/register",
  JoiMiddleware(registerSchema),
  AuthService.register
);

authRouter.post("/logout", authenticateWithJWT, AuthService.logout);
export default authRouter;
