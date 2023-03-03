import {
  badRequestResponse,
  okResponse,
  unAuthorizedResponse,
} from "../../helpers/functions/ResponseHandler.js";
import { prisma } from "../../index.js";
export async function getAllUsers(req, res, next) {
  try {
    let { id, firstname, middlename, lastname, role, department, email } =
      req.query;
    const loggedInUser = req.user;
    if (loggedInUser.role !== "admin")
      return unAuthorizedResponse(res, "not authrized");
    let user;
    if (JSON.stringify(req.query) === "{}") {
      user = await prisma.user.findMany({});
    } else {
      user = await prisma.user.findMany({
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

    if (role === false) {
      user.map((e) => delete e.role);
    }
    user.map((e) => delete e.password);
    return okResponse(res, "user rerieved successfully", user);
  } catch (err) {
    next(err);
  }
}
