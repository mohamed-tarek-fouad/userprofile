import {
  badRequestResponse,
  conflictResponse,
  okResponse,
} from "../../helpers/functions/ResponseHandler.js";
import { prisma } from "../../index.js";
import bcrypt from "bcrypt";
import createAccessToken from "../../helpers/functions/createAccessToken.js";
export async function register(req, res, next) {
  try {
    let { email, password, firstname, lastname, middlename, department, confirmPassword } =
      req.body;
    if(password!==confirmPassword){
      return badRequestResponse(res,"confirm password is not the same as password")
    }
    const checkEmail = await prisma.Users.findUnique({
      where: {
        email,
      },
    });
    if (checkEmail) {
      return conflictResponse(res, "Email already exists");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.Users.create({
      data: {
        email,
        password: encryptedPassword,
        firstname,
        lastname,
        department,
        middlename,
        confirmPassword,
      },
    });
    const newToken = await prisma.tokens.create({
      data: {
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    const accessToken = createAccessToken(newUser.id, newToken.id);
    delete newUser.password;
    return okResponse(res, "User created successfully", {
      ...newUser,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
}