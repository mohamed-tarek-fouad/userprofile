import {
  badRequestResponse,
  conflictResponse,
  okResponse,
} from "../../helpers/functions/ResponseHandler.js";
import { prisma } from "../../index.js";
import bcrypt from "bcrypt";
export async function addUserOrAdmin(req, res, next) {
  try {
    const loggedInUser = req.user;
    let {
      email,
      password,
      firstname,
      lastname,
      middlename,
      department,
      confirmPassword,
      role,
    } = req.body;
    if (loggedInUser.role === "user") role = "user";
    if (password !== confirmPassword) {
      return badRequestResponse(
        res,
        "confirm password is not the same as password"
      );
    }
    const checkEmail = await prisma.User.findUnique({
      where: {
        email,
      },
    });
    if (checkEmail) {
      return conflictResponse(res, "Email already exists");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.User.create({
      data: {
        email,
        password: encryptedPassword,
        firstname,
        lastname,
        department,
        middlename,
      },
    });
    delete newUser.password;
    return okResponse(res, "User created successfully", {
      ...newUser,
    });
  } catch (err) {
    next(err);
  }
}
