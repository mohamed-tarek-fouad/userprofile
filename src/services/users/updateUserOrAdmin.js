import {
  conflictResponse,
  okResponse,
} from "../../helpers/functions/ResponseHandler.js";
import { prisma } from "../../index.js";
export async function updateUserOrAdmin(req, res, next) {
  try {
    const { userId } = req.params;
    const loggedInUser = req.user;
    let { email, firstname, lastname, middlename, department, role } = req.body;
    if (loggedInUser.role === "user") role = "user";
    const checkEmail = email
      ? await prisma.user.findUnique({
          where: {
            email,
          },
        })
      : null;
    if (checkEmail) {
      return conflictResponse(res, "Email already exists");
    }
    const newUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email,
        firstname,
        lastname,
        middlename,
        department,
        role,
      },
    });
    delete newUser.password;
    return okResponse(res, "User updated successfully", {
      ...newUser,
    });
  } catch (err) {
    next(err);
  }
}
