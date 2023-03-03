import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
const JoiPassword = Joi.extend(joiPasswordExtendCore);
const updateUserOrAdminSchema = Joi.object({
  email: Joi.string().email().optional(),
  firstname: Joi.string().min(2).max(12).optional(),
  lastname: Joi.string().min(2).max(12).optional(),
  middlename: Joi.string().min(2).max(12).optional(),
  department: Joi.string().max(20).optional(),
  role: Joi.string().valid("user", "admin").optional(),
});

export default updateUserOrAdminSchema;
