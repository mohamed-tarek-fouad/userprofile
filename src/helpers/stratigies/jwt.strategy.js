import { Strategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import { prisma } from "../../index.js";
dotenv.config();
const JWTStrategy = new Strategy(
  {
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload, done) => {
    try {
      const token = await prisma.tokens.findUnique({
        where: {
          id: payload.tokenId,
        },
        include: {
          user: true,
        },
      });
      if (token) {
        return done(null, { ...token.user, tokenId: token.id });
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }
);

export default JWTStrategy;
