import { pool } from '../../config/db';
import { Usuario } from '../../models/usuario';
import logger from '../logger/loggerService';
import bcrypt from 'bcryptjs';

export const buscarUsuarioPorUsername = async (username: string): Promise<Usuario | null> => {
    logger.debug(`UsuarioService:buscarUsuarioPorUsername - Inicio`)
    logger.info(`UsuarioService:buscarUsuarioPorUsername - username: ${username}`)
    const [rows]: any = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    logger.debug(`UsuarioService:buscarUsuarioPorUsername - Fin`)
    return rows.length ? rows[0] : null;
};

export const crearUsuario = async (username: string, password: string, correo:string, role: 'admin' | 'user') => {
    logger.debug(`UsuarioService:crearUsuario - Inicio`)
    const hashPass = await bcrypt.hash(password, 10);
    logger.info(`UsuarioService:crearUsuario - data: ${JSON.stringify({username, hashPass, correo, role})}`)
    await pool.query('INSERT INTO usuarios (username, password, correo, role) VALUES (?, ?, ?, ?)', [username, hashPass, correo, role]);
    logger.debug(`UsuarioService:crearUsuario - Fin`)
};