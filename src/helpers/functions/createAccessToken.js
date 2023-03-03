import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export default function createAccessToken(userId, tokenId) {
  return jwt.sign({ userId, tokenId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
}
