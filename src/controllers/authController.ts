import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { buscarUsuarioPorUsername, crearUsuario } from '../services/usuarioService';
import { generarJwtSchema, registroSchema } from '../models/validaciones/authSchema';
import bcrypt from 'bcrypt';

export const generarJwt = async (req: Request, res: Response): Promise<any> => {
    try {
        const { error } = generarJwtSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        
        const { username, password } = req.body;
        const user = await buscarUsuarioPorUsername(username);
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ username, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const registro = async (req: Request, res: Response): Promise<any> => {
    try {
        const { error } = registroSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { username, password, role } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = await buscarUsuarioPorUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }
        
        await crearUsuario(username, password, role);
        return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const validarToken = async (req: Request, res: Response): Promise<any> => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido o expirado' });
        return res.json({ valid: true, user });
    });
};