import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
const JoiPassword = Joi.extend(joiPasswordExtendCore);
const addUserOrAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: JoiPassword.string()
    .min(8)
    .max(12)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .required(),
  confirmPassword: JoiPassword.string()
    .min(8)
    .max(12)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .required(),
  firstname: Joi.string().min(2).max(12).required(),
  lastname: Joi.string().min(2).max(12).required(),
  middlename: Joi.string().min(2).max(12).optional(),
  department: Joi.string().max(20).optional(),
  role: Joi.string().valid("user", "admin").optional(),
});

export default addUserOrAdminSchema;
