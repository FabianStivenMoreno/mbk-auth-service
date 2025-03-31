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
    capacidad_restante_kg FLOAT NOT NULL,  -- Nueva columna para capacidad disponible en kg
    capacidad_restante_volumen_m3 FLOAT NOT NULL, -- Nueva columna para volumen disponible
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
    estado_actual ENUM('En espera', 'En tránsito', 'Entregado', 'Cancelado') NOT NULL DEFAULT 'En espera',
    usuario_id INT NOT NULL,
    vehiculo_id INT NULL,
    origen_ciudad_id INT NOT NULL,
    destino_ciudad_id INT NOT NULL,
    destino_calle VARCHAR(100) NOT NULL,
    destino_carrera VARCHAR(100) NOT NULL,
    destino_complemento VARCHAR(100) NOT NULL,
    destino_detalle VARCHAR(255) NULL,
    ruta_id INT NULL,
    transportista_id INT NULL,
    fecha_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_entrega DATETIME NULL,
    costo_envio DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Nueva columna para el costo del envío
    notificado_usuario BOOLEAN NOT NULL DEFAULT FALSE, -- Indica si el usuario fue notificado
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
    volumen_cm3 FLOAT GENERATED ALWAYS AS (alto_cm * ancho_cm * profundidad_cm) STORED, -- Cálculo automático de volumen
    tipo_producto VARCHAR(100) NOT NULL,
    es_delicado BOOLEAN NOT NULL DEFAULT FALSE,
    envio_id INT NOT NULL,
    FOREIGN KEY (envio_id) REFERENCES envios(id)
);

-- ===============================================================
-- Tabla para historial de estados de envíos
-- ===============================================================
CREATE TABLE estado_envios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    envio_id INT NOT NULL,
    estado ENUM('En espera', 'En tránsito', 'Entregado', 'Cancelado') NOT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (envio_id) REFERENCES envios(id)
);

-- ===============================================================
-- Inserción de datos 
-- ===============================================================

-- ===============================================================
-- Poblar tabla de ciudades
-- ===============================================================
INSERT INTO ciudades (nombre, pais)
VALUES
  ('Bogotá', 'Colombia'),
  ('Medellín', 'Colombia'),
  ('Cali', 'Colombia'),
  ('Barranquilla', 'Colombia'),
  ('Cartagena', 'Colombia');

-- ===============================================================
-- Poblar tabla de rutas
-- ===============================================================
INSERT INTO rutas (origen_ciudad_id, destino_ciudad_id)
VALUES
  (1, 2),  -- Ruta Bogotá -> Medellín
  (1, 3),  -- Ruta Bogotá -> Cali
  (2, 4),  -- Ruta Medellín -> Barranquilla
  (3, 5),  -- Ruta Cali -> Cartagena
  (4, 5);  -- Ruta Barranquilla -> Cartagena

-- ===============================================================
-- Poblar tabla de transportistas
-- ===============================================================
INSERT INTO transportistas (nombre, telefono, estado, ciudad_id)
VALUES
  ('Carlos Pérez', '3216549870', 'Disponible', 1),  -- Bogotá
  ('Andrea Gómez', '3114567890', 'Disponible', 2),  -- Medellín
  ('Luis Martínez', '3001234567', 'Disponible', 3), -- Cali
  ('Ana Ramírez', '3229876540', 'Disponible', 4),   -- Barranquilla
  ('Pedro Ruiz', '3204567891', 'Disponible', 5);    -- Cartagena

-- ===============================================================
-- Poblar tabla de vehículos
-- ===============================================================
INSERT INTO vehiculos (
  tipo, capacidad_kg_original, capacidad_alto_metros, capacidad_ancho_metros, capacidad_profundidad_metros, volumen_total_m3, matricula, estado, ciudad_id, capacidad_restante_kg, capacidad_restante_volumen_m3
)
VALUES
  ('Camión', 5000, 2.5, 2.5, 6, 37.5, 'ABC123', 'Disponible', 1, 5000, 37.5),  -- Bogotá
  ('Furgoneta', 2000, 2, 2, 4, 16, 'DEF456', 'Disponible', 2, 2000, 16),       -- Medellín
  ('Moto', 100, 1.5, 0.6, 0.8, 0.72, 'GHI789', 'Disponible', 3, 100, 0.72),    -- Cali
  ('Camión', 8000, 3, 2.8, 7, 58.8, 'JKL012', 'Disponible', 4, 8000, 58.8),    -- Barranquilla
  ('Furgoneta', 2500, 2.2, 2, 4.5, 19.8, 'MNO345', 'Disponible', 5, 2500, 19.8); -- Cartagena