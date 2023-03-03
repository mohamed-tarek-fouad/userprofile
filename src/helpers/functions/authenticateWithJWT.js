import passport from "passport";
import {
  internalServerErrorResponse,
  unAuthorizedResponse,
} from "./ResponseHandler.js";

export default async function authenticateWithJWT(req, res, next) {
  const authenticationFunction = passport.authenticate(
    "jwt",
    { session: false },
    async (clientError, data, err) => {
      if (err) {
        if (err.message === "jwt expired") {
          return unAuthorizedResponse(res, "Session expired");
        }
        if (err.message === "invalid signature") {
          return unAuthorizedResponse(res, "Invalid signature");
        }
        return internalServerErrorResponse(res, "no token ");
      }
      if (clientError) {
        return internalServerErrorResponse(res, clientError);
      }
      if (!data) {
        return unAuthorizedResponse(res, "Invalid token");
      }
      req.user = data;
      next();
    }
  );
  return authenticationFunction(req, res, next);
}
