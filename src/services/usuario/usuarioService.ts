import { pool } from '../../config/db';
import { Usuario } from '../../models/usuario';
import logger from '../logger/loggerService';
import bcrypt from 'bcryptjs';

/**
 * Busca un usuario por su nombre de usuario
 */
export const buscarUsuarioPorUsername = async (username: string): Promise<Usuario | null> => {
    logger.debug(`UsuarioService:buscarUsuarioPorUsername - Inicio`);
    logger.info(`UsuarioService:buscarUsuarioPorUsername - username: ${username}`);

    try {
        const [rows]: any = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        logger.debug(`UsuarioService:buscarUsuarioPorUsername - Fin`);
        return rows.length ? rows[0] : null;
    } catch (error: any) {
        logger.error(`UsuarioService:buscarUsuarioPorUsername - Error en la consulta: ${error.message}`);
        throw new Error('Error al buscar usuario por username.');
    }
};

/**
 * Busca un usuario por su correo electrónico
 */
export const buscarUsuarioPorCorreo = async (correo: string): Promise<Usuario | null> => {
    logger.debug(`UsuarioService:buscarUsuarioPorCorreo - Inicio`);
    logger.info(`UsuarioService:buscarUsuarioPorCorreo - correo: ${correo}`);

    try {
        const [rows]: any = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        logger.debug(`UsuarioService:buscarUsuarioPorCorreo - Fin`);
        return rows.length ? rows[0] : null;
    } catch (error: any) {
        logger.error(`UsuarioService:buscarUsuarioPorCorreo - Error en la consulta: ${error.message}`);
        throw new Error('Error al buscar usuario por correo.');
    }
};

/**
 * Crea un nuevo usuario en la base de datos
 */
export const crearUsuario = async (username: string, password: string, correo: string, role: 'admin' | 'user') => {
    logger.debug(`UsuarioService:crearUsuario - Inicio`);
    const hashPass = await bcrypt.hash(password, 10);
    logger.info(`UsuarioService:crearUsuario - data: ${JSON.stringify({ username, hashPass, correo, role })}`);

    try {
        // Verificar si el username ya existe
        const existingUser = await buscarUsuarioPorUsername(username);
        if (existingUser) {
            logger.warn(`UsuarioService:crearUsuario - Nombre de usuario duplicado: ${username}`);
            throw new Error('El nombre de usuario ya está en uso.');
        }

        // Verificar si el correo ya existe
        const existingEmail = await buscarUsuarioPorCorreo(correo);
        if (existingEmail) {
            logger.warn(`UsuarioService:crearUsuario - Correo duplicado: ${correo}`);
            throw new Error('El correo ya está en uso.');
        }

        // Insertar usuario en la base de datos
        await pool.query('INSERT INTO usuarios (username, password, correo, role) VALUES (?, ?, ?, ?)', [username, hashPass, correo, role]);

        logger.debug(`UsuarioService:crearUsuario - Fin`);
    } catch (error: any) {
        logger.error(`UsuarioService:crearUsuario - Error inesperado: ${error.message}`);
        throw error;
    }
};
