import { pool } from '../config/db';
import { Usuario } from '../models/usuario';
import bcrypt from 'bcryptjs';

export const buscarUsuarioPorUsername = async (username: string): Promise<Usuario | null> => {
    const [rows]: any = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    return rows.length ? rows[0] : null;
};

export const crearUsuario = async (username: string, password: string, role: 'admin' | 'user') => {
    const hashPass = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)', [username, hashPass, role]);
};