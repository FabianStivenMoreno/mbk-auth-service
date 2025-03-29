import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { buscarUsuarioPorUsername, crearUsuario } from '../services/usuario/usuarioService';
import { generarJwtSchema, registroSchema } from '../models/validaciones/authSchema';
import logger from '../services/logger/loggerService';
import bcrypt from 'bcryptjs';

export const generarJwt = async (req: Request, res: Response): Promise<any> => {
    logger.debug(`AuthController:generarJwt - Inicio`)
    try {
        const { error } = generarJwtSchema.validate(req.body);
        if (error) {
            logger.error(`AuthController:generarJwt - Error en la validación del schema: ${JSON.stringify(error.details)}`)
            return res.status(400).json({ message: error.details[0].message });
        }
        
        const { username, password } = req.body;

        const user = await buscarUsuarioPorUsername(username);
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            logger.error(`AuthController:generarJwt - Error en la validación de la contraseña: Credenciales inválidas`)
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ username, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        logger.info(`AuthController:generarJwt - token generado: ${token}`)
        logger.debug(`AuthController:generarJwt - Fin`)
        return res.json({ token });
    } catch (error) {
        logger.error(`AuthController:generarJwt - Error interno en el servidor ${error}`)
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const registro = async (req: Request, res: Response): Promise<any> => {
    logger.debug(`AuthController:registro - Inicio`)
    try {
        const { error } = registroSchema.validate(req.body);
        if (error) {
            logger.error(`AuthController:registro - Error en la validación del schema: ${JSON.stringify(error.details)}`)
            return res.status(400).json({ message: error.details[0].message });
        }

        const { username, password, correo, role } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = await buscarUsuarioPorUsername(username);
        if (existingUser) {
            logger.error(`AuthController:registro - Error en el registro del usuario: El username [${username}] no está disponible`)
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }
        
        await crearUsuario(username, password, correo, role);
        logger.info(`AuthController:registro - Usuario [${username}] registrado exitosamente`)
        logger.debug(`AuthController:registro - Fin`)
        return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        logger.error(`AuthController:generarJwt - Error interno en el servidor: ${error}`)
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const validarToken = async (req: Request, res: Response): Promise<any> => {
    logger.debug(`AuthController:validarToken - Inicio`)
    const token = req.header('Authorization')?.split(' ')[1];
    logger.info(`AuthController:validarToken - Token a validar: ${token}`)
    if (!token) {
        logger.error(`AuthController:validarToken - Error el token es requerido`)
        return res.status(401).json({ message: 'Token requerido' });
    } 

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            logger.error(`AuthController:validarToken - Error el token no es valido o está expirado`)
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }
        logger.debug(`AuthController:validarToken - Fin`) 
        return res.json({ valid: true, user });
    });
};