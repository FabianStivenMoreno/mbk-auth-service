import Joi from 'joi';

export const generarJwtSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

export const registroSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'user').required()
});