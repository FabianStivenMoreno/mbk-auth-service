DROP DATABASE IF EXISTS prueba_coordinadora;
CREATE DATABASE prueba_coordinadora;
USE prueba_coordinadora;

-- ===============================================================
-- Tabla de ciudades
-- ===============================================================
CREATE TABLE ciudades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    pais VARCHAR(50) NOT NULL
);

-- ===============================================================
-- Tabla de usuarios
-- ===============================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'user') NOT NULL
);

-- ===============================================================
-- Tabla de vehículos
-- ===============================================================
CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    capacidad_kg_original FLOAT NOT NULL,
    capacidad_alto_metros FLOAT NOT NULL,
    capacidad_ancho_metros FLOAT NOT NULL,
    capacidad_profundidad_metros FLOAT NOT NULL,
    volumen_total_m3 FLOAT NOT NULL,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    estado ENUM('Disponible', 'Ocupado') NOT NULL DEFAULT 'Disponible',
    ciudad_id INT NOT NULL,
    kg_disponible FLOAT NOT NULL,
    volumen_disponible_m3 FLOAT NOT NULL,
    FOREIGN KEY (ciudad_id) REFERENCES ciudades(id)
);

-- ===============================================================
-- Tabla de transportistas
-- ===============================================================
CREATE TABLE transportistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    estado ENUM('Disponible', 'Ocupado') NOT NULL DEFAULT 'Disponible',
    ciudad_id INT NOT NULL,
    FOREIGN KEY (ciudad_id) REFERENCES ciudades(id)
);

-- ===============================================================
-- Tabla de rutas
-- ===============================================================
CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origen_ciudad_id INT NOT NULL,
    destino_ciudad_id INT NOT NULL,
    FOREIGN KEY (origen_ciudad_id) REFERENCES ciudades(id),
    FOREIGN KEY (destino_ciudad_id) REFERENCES ciudades(id)
);

-- ===============================================================
-- Tabla de envíos
-- ===============================================================
CREATE TABLE envios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estado_actual ENUM('En espera', 'En tránsito', 'Entregado') NOT NULL DEFAULT 'En espera',
    usuario_id INT NOT NULL,
    vehiculo_id INT NOT NULL,
    origen_ciudad_id INT NOT NULL,
    destino_ciudad_id INT NOT NULL,
    destino_calle VARCHAR(100) NOT NULL,
    destino_carrera VARCHAR(100) NOT NULL,
    destino_complemento VARCHAR(100) NOT NULL,
    destino_detalle VARCHAR(255) NULL,
    ruta_id INT NULL,
    transportista_id INT NULL, -- Nueva columna para asociar transportista a un envío
    fecha_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_entrega DATETIME NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id),
    FOREIGN KEY (origen_ciudad_id) REFERENCES ciudades(id),
    FOREIGN KEY (destino_ciudad_id) REFERENCES ciudades(id),
    FOREIGN KEY (ruta_id) REFERENCES rutas(id),
    FOREIGN KEY (transportista_id) REFERENCES transportistas(id)
);

-- ===============================================================
-- Tabla de paquetes
-- ===============================================================
CREATE TABLE paquetes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    peso_lb FLOAT NOT NULL,
    alto_cm FLOAT NOT NULL,
    ancho_cm FLOAT NOT NULL,
    profundidad_cm FLOAT NOT NULL,
    tipo_producto VARCHAR(100) NOT NULL,
    es_delicado BOOLEAN NOT NULL DEFAULT FALSE,
    envio_id INT NOT NULL,
    ruta_id INT NULL,
    FOREIGN KEY (envio_id) REFERENCES envios(id),
    FOREIGN KEY (ruta_id) REFERENCES rutas(id)
);