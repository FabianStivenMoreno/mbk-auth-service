import express from 'express';
import { generarJwt, registro, validarToken } from '../controllers/authController';
const router = express.Router();
router.post('/generarJwt', generarJwt);
router.post('/registro', registro);
router.get('/validar', validarToken);
export default router;