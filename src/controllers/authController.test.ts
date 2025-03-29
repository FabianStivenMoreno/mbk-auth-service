import request from 'supertest';
import app from '../index';
import jwt from 'jsonwebtoken';
import * as userService from '../services/usuario/usuarioService';

jest.mock('../services/usuario/usuarioService')

const mockBodyRequestRegistro = {
    username: 'testuser',
    password: 'password123',
    correo: 'mail@mail.com',
    role: 'user'
}

const mockBodyRequestRegistroErrorEstructura = {
    username: 'testuser',
    password: 'password123'
}

const mockBodyRequestGenerarJwtOk =  {
    username: 'testuser', 
    password: '123456'
}

const mockBodyRequestGenerarJwtErrorEstructura =  {
    username: 'testuser'
}

const mockBodyRequestGenerarJwtErrorCredenciales =  {
    username: 'testuser', 
    password: '654321'
}

const responseBdBuscarUsuario = { 
    id: 1, 
    username: 'testuser', 
    password: '$2b$10$tEUw.ubjHeGqf/l5LTLNwOh0ZTFA1P70rZeklnFt8VT7gM.nKMtsS',
    correo: 'mail@mail.com', 
    role: 'user' 
}


describe('AuthController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // TEST CASES /registro

    test('(/registro) - Debería registrar un nuevo usuario', async () => {
        (userService.buscarUsuarioPorUsername as jest.Mock).mockResolvedValue(null);
        (userService.crearUsuario as jest.Mock).mockResolvedValue(undefined);
        const res = await request(app).post('/auth/v1/authenticate/registro').send(mockBodyRequestRegistro)
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('message')
    })

    test('(/registro) - No se debería registrar usuario por error en estructura', async () => {
        (userService.buscarUsuarioPorUsername as jest.Mock).mockResolvedValue(null);
        (userService.crearUsuario as jest.Mock).mockResolvedValue(undefined);
        const res = await request(app).post('/auth/v1/authenticate/registro').send(mockBodyRequestRegistroErrorEstructura)
        expect(res.status).toBe(400)
    })

    test('(/registro) - No se debería registrar usuario por error interno en el servidor', async () => {
        (userService.buscarUsuarioPorUsername as jest.Mock).mockResolvedValue(null);
        (userService.crearUsuario as jest.Mock).mockRejectedValue(undefined);
        const res = await request(app).post('/auth/v1/authenticate/registro').send(mockBodyRequestRegistro)
        expect(res.status).toBe(500)
        expect(res.body.message).toEqual('Error en el servidor')
    })

    test('(/registro) - No se debería registrar usuario duplicado', async () => {
        (userService.buscarUsuarioPorUsername as jest.Mock).mockResolvedValue(responseBdBuscarUsuario)

        const res = await request(app).post('/auth/v1/authenticate/registro').send(mockBodyRequestRegistro)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message')
    })

    // TEST CASES /generarJwt

    test('(/generarJwt) - Debería generar token con credenciales validas', async () => {
        (userService.buscarUsuarioPorUsername as jest.Mock).mockResolvedValue(responseBdBuscarUsuario)
     
        const res = await request(app).post('/auth/v1/authenticate/generarJwt').send(mockBodyRequestGenerarJwtOk)
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token')
    });

    test('(/generarJwt) - No se debería generar token error de estructura', async () => {
        const res = await request(app).post('/auth/v1/authenticate/generarJwt').send(mockBodyRequestGenerarJwtErrorEstructura)
        expect(res.status).toBe(400)
    });

    test('(/generarJwt) - No se debería generar token error de credenciales', async () => {
        (userService.buscarUsuarioPorUsername as jest.Mock).mockResolvedValue(responseBdBuscarUsuario)
     
        const res = await request(app).post('/auth/v1/authenticate/generarJwt').send(mockBodyRequestGenerarJwtErrorCredenciales)
        expect(res.status).toBe(401)
        expect(res.body.message).toEqual('Credenciales inválidas')
    });

    test('(/generarJwt) - No se debería generar token error tecnico en consulta', async () => {
        (userService.buscarUsuarioPorUsername as jest.Mock).mockRejectedValue(new Error('internal_server_error'))
     
        const res = await request(app).post('/auth/v1/authenticate/generarJwt').send(mockBodyRequestGenerarJwtOk)
        expect(res.status).toBe(500)
        expect(res.body.message).toEqual('Error en el servidor')
    })

    // TEST CASES /validarToken
    test('should validate a valid token', async () => {
        const token = jwt.sign({ username: 'testuser', role: 'user' }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        const res = await request(app).get('/auth/v1/authenticate/validar').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('valid', true);
    });

    test('should reject request without token', async () => {
        const res = await request(app).get('/auth/v1/authenticate/validar');
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Token requerido');
    });

    it('should reject an invalid token', async () => {
        const res = await request(app).get('/auth/v1/authenticate/validar').set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('message', 'Token inválido o expirado');
    });
})