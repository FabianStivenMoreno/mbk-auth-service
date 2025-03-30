import { pool } from '../../config/db';
import { buscarUsuarioPorUsername, buscarUsuarioPorCorreo, crearUsuario } from '../usuario/usuarioService';
import bcrypt from 'bcryptjs';

jest.mock('../../config/db', () => ({
    pool: {
        query: jest.fn()
    }
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(() => 'hashedPassword')
}));

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Debería buscar un usuario por username', async () => {
        const mockUser = [[{ id: 1, username: 'testUser', password: 'hashedPassword', correo: 'mail@mail.com', role: 'user' }]];
        (pool.query as jest.Mock).mockResolvedValue(mockUser);

        const user = await buscarUsuarioPorUsername('testUser');
        expect(user).toEqual(mockUser[0][0]);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE username = ?', ['testUser']);
    });

    test('Debería retornar null si el usuario no existe', async () => {
        (pool.query as jest.Mock).mockResolvedValue([[]]);

        const user = await buscarUsuarioPorUsername('nonExistentUser');
        expect(user).toBeNull();
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE username = ?', ['nonExistentUser']);
    });

    test('Debería lanzar un error si falla la consulta de username', async () => {
        (pool.query as jest.Mock).mockRejectedValue(new Error('Database Error'));

        await expect(buscarUsuarioPorUsername('errorUser')).rejects.toThrow('Error al buscar usuario por username.');
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE username = ?', ['errorUser']);
    });

    test('Debería buscar un usuario por correo', async () => {
        const mockUser = [[{ id: 1, username: 'testUser', correo: 'mail@mail.com', role: 'user' }]];
        (pool.query as jest.Mock).mockResolvedValue(mockUser);

        const user = await buscarUsuarioPorCorreo('mail@mail.com');
        expect(user).toEqual(mockUser[0][0]);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE correo = ?', ['mail@mail.com']);
    });

    test('Debería retornar null si el correo no existe', async () => {
        (pool.query as jest.Mock).mockResolvedValue([[]]);

        const user = await buscarUsuarioPorCorreo('nonexistent@mail.com');
        expect(user).toBeNull();
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE correo = ?', ['nonexistent@mail.com']);
    });

    test('Debería lanzar un error si falla la consulta de correo', async () => {
        (pool.query as jest.Mock).mockRejectedValue(new Error('Database Error'));

        await expect(buscarUsuarioPorCorreo('error@mail.com')).rejects.toThrow('Error al buscar usuario por correo.');
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM usuarios WHERE correo = ?', ['error@mail.com']);
    });

    test('Debería crear un usuario con la password encriptada', async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce([[]]);
        (pool.query as jest.Mock).mockResolvedValueOnce([[]]); 
        (pool.query as jest.Mock).mockResolvedValue([{ affectedRows: 1 }]);

        await crearUsuario('newUser', 'password123', 'mail@mail.com', 'admin');

        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO usuarios (username, password, correo, role) VALUES (?, ?, ?, ?)',
            ['newUser', 'hashedPassword', 'mail@mail.com', 'admin']
        );
    });

    test('Debería lanzar un error si el nombre de usuario ya está en uso', async () => {
        const existingUser = [[{ id: 1, username: 'testUser', correo: 'mail@mail.com', role: 'user' }]];
        (pool.query as jest.Mock).mockResolvedValueOnce(existingUser);

        await expect(crearUsuario('testUser', 'password123', 'new@mail.com', 'user'))
            .rejects.toThrow('El nombre de usuario ya está en uso.');
    });

    test('Debería lanzar un error si el correo ya está en uso', async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce([[]]);
        (pool.query as jest.Mock).mockResolvedValueOnce([[{ correo: 'mail@mail.com' }]]);

        await expect(crearUsuario('usuarioTest1', 'password123', 'mail@mail.com', 'user'))
            .rejects.toThrow('El correo ya está en uso.');
    });
});
