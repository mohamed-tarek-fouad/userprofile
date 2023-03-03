import {
  badRequestResponse,
  okResponse,
  unAuthorizedResponse,
} from "../../helpers/functions/ResponseHandler.js";
import { prisma } from "../../index.js";
export async function getUserById(req, res, next) {
  try {
    const { userId } = req.params;
    let user;
    let { id, firstname, middlename, lastname, role, department, email } =
      req.query;
    const loggedInUser = req.user;
    if (JSON.stringify(req.query) === "{}") {
      user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: id ? true : false,
          firstname: firstname ? true : false,
          lastname: lastname ? true : false,
          middlename: middlename ? true : false,
          email: email ? true : false,
          role,
          department: department ? true : false,
        },
      });
      if (!role) role = false;
    }
    if (!user) return badRequestResponse(res, "user doesn't exist");
    if (user.role === "admin" && loggedInUser.role === "user") {
      return unAuthorizedResponse(res, "you are not authorized");
    }
    if (role === false) delete user.role;
    delete user.password;
    return okResponse(res, "user rerieved successfully", user);
  } catch (err) {
    next(err);
  }
}
