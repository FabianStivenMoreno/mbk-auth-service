# mbk-auth-service

Este servicio de autenticación está construido con **Node.js**, **Express**, **TypeScript** y usa **MySQL** como base de datos. Se puede ejecutar en contenedores Docker.

## 📦 Instalación

### 1. Clonar el repositorio
```sh
git clone <URL_DEL_REPOSITORIO>
cd mbk-auth-service
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con:
```env
PUERTO=puerto donde va a correr el servidor [ejemplo: 3000]
ROOT_PATH=Path raiz del proyecto [ejemplo: /auth/v1]
LOGGER_LEVEL=Nivel de loggeo [ejemplo: debug, warn o info]
NODE_ENV=Entorno donde se está ejecutando [ejemplo: dev, test o main]
DB_HOST=Host donde está la base de datos [ejemplo: localhost] 
DB_PORT=Puerto donde está corriendo la base de datos [ejemplo: 3307] 
DB_USER=Usuario de base de datos [ejemplo: root]
DB_PASS=Password o contraseña para autenticación con base de datos [ejemplo: passwordcualquiera123]
DB_NAME=Nombre de la base de datos [ejemplo: prueba_coordinadora] 
JWT_SECRET=Secreto para firmar y validar JWTs [ejemplo: supersecreto]
```

### 3. Iniciar la base de datos con Docker
```sh
docker-compose up -d
```

### 4. Instalar dependencias
```sh
npm install
```

### 5. Compilar TypeScript
```sh
npm run build
```

### 6. Iniciar el servicio
```sh
npm start
```

## 🛠 Pruebas
Ejecuta los tests con:
```sh
npm test
```

## 📖 Documentación API
La documentación OpenAPI se genera automáticamente y se puede acceder en:
```
http://localhost:3000/api-docs
```

