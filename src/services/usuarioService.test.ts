import { pool } from '../config/db';
import { buscarUsuarioPorUsername, crearUsuario } from '../services/usuarioService';
import bcrypt from 'bcryptjs';

jest.mock('../config/db', () => ({
    pool: {
        query: jest.fn()
    }
}));

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Debería buscar usuario por username', async () => {
        const mockUser = [{ id: 1, username: 'testUser', password: 'hashedPassword', correo: 'mail@mail.com', role: 'user' }];
        (pool.query as jest.Mock).mockResolvedValue([mockUser]);

        const user = await buscarUsuarioPorUsername('testUser');
        expect(user).toEqual(mockUser[0]);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE username = ?', ['testUser']);
    });

    test('Debería retornar null si el usuario no se encuentra', async () => {
        (pool.query as jest.Mock).mockResolvedValue([[]]);

        const user = await buscarUsuarioPorUsername('nonExistentUser');
        expect(user).toBeNull();
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE username = ?', ['nonExistentUser']);
    });

    test('Debería crear un usuario con la password encriptada', async () => {
        const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
        (pool.query as jest.Mock).mockResolvedValue([{ affectedRows: 1 }]);

        await crearUsuario('newUser', 'password123', 'mail@mail.com', 'admin');
        expect(hashSpy).toHaveBeenCalledWith('password123', 10);
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO usuarios (username, password, correo, role) VALUES (?, ?, ?, ?)',
            ['newUser', 'hashedPassword', 'mail@mail.com', 'admin']
        );
    });
});