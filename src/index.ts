import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import logger from './services/logger/loggerService';
import authRoutes from './routes/authRoutes';
import { setupSwagger } from "./config/swagger";

dotenv.config()

const app = express()

// Config
app.use(express.json())
app.use(morgan('dev'));

const raiz = process.env.ROOT_PATH || '/'

// Configuracion swagger
setupSwagger(app); 

// Configurar las rutas
app.use(`${raiz}/authenticate`, authRoutes);                                     

const port = process.env.PUERTO || 5000

const server = app.listen(port, () => {
    logger.info(`Servidor escuchando en el puerto ${port}`)
    logger.info(`API disponible en: http://localhost:${port}${raiz}`);
  })



export default app;
export { server };