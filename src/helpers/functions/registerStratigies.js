import passport from "passport";
import JWTStrategy from "../stratigies/jwt.strategy.js";
export default function registerStrategies() {
  passport.use("jwt", JWTStrategy);
}
