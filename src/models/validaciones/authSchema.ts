import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';
const joiPass = Joi.extend(joiPasswordExtendCore)

export const generarJwtSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
});

export const registroSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: joiPass.string().min(8).minOfSpecialCharacters(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().required(),
    correo: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'user').required()
});