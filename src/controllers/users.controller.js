import { Router } from "express";
import loginSchema from "../helpers/schemas/login.schema.js";
import registerSchema from "../helpers/schemas/register.schema.js";
import * as AuthService from "../services/users/index.js";
import JoiMiddleware from "../helpers/middlewares/joiMiddleware.js";
import authenticateWithJWT from "../helpers/functions/authenticateWithJWT.js";
import addUserOrAdminSchema from "./../helpers/schemas/addUserOrAdmin.schema.js";
import updateUserOrAdminSchema from "../helpers/schemas/updateUserOrAdmin.schema.js";
const authRouter = Router();

authRouter.post("/login", JoiMiddleware(loginSchema), AuthService.login);
authRouter.post(
  "/register",
  JoiMiddleware(registerSchema),
  AuthService.register
);

authRouter.post("/logout", authenticateWithJWT, AuthService.logout);
authRouter.post(
  "/addUserOrAdmin",
  JoiMiddleware(addUserOrAdminSchema),
  authenticateWithJWT,
  AuthService.addUserOrAdmin
);
authRouter.patch(
  "/updateUserOrAdmin/:userId",
  JoiMiddleware(updateUserOrAdminSchema),
  authenticateWithJWT,
  AuthService.updateUserOrAdmin
);
export default authRouter;
