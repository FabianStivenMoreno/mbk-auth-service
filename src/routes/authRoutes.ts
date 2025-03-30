import express from 'express';
import { generarJwt, registro, validarToken } from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /generarJwt:
 *   post:
 *     summary: Genera un token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "usuario1"
 *               password:
 *                 type: string
 *                 example: "contraseña123"
 *     responses:
 *       200:
 *         description: Token generado exitosamente
 *       400:
 *         description: Error en la validación del schema
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/generarJwt', generarJwt);

/**
 * @swagger
 * /registro:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "nuevoUsuario"
 *               password:
 *                 type: string
 *                 example: "secreto123"
 *               correo:
 *                 type: string
 *                 example: "correo@ejemplo.com"
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la validación de datos
 */
router.post('/registro', registro);

/**
 * @swagger
 * /validar:
 *   get:
 *     summary: Valida un token JWT
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Token inválido o expirado
 */
router.get('/validar', validarToken);

export default router;
