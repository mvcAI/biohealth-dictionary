-- Configuración inicial de la base de datos para la aplicación de biodescodificación
-- Este script debe ejecutarse en el SQL Editor de Supabase

-- Habilitar Row Level Security (RLS)
-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de dolencias (información del diccionario de Eric Corbera)
CREATE TABLE IF NOT EXISTS dolencias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(100),
    palabras_clave TEXT[], -- Para mejorar las búsquedas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de usuarios (se creará automáticamente con Supabase Auth)
-- Solo necesitamos crear una tabla de perfiles para información adicional
CREATE TABLE IF NOT EXISTS perfiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nombre_completo VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    ocupacion VARCHAR(100),
    objetivo_terapeutico TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de progreso personal del usuario
CREATE TABLE IF NOT EXISTS progresos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dolencia_id UUID REFERENCES dolencias(id) ON DELETE CASCADE NOT NULL,
    nota_personal TEXT,
    nivel_mejora INTEGER CHECK (nivel_mejora >= 1 AND nivel_mejora <= 10), -- 1-10 escala de mejora
    fecha_consulta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_seguimiento TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(50) DEFAULT 'activo', -- activo, resuelto, en_proceso
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de consultas online
CREATE TABLE IF NOT EXISTS consultas_online (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mensaje TEXT NOT NULL,
    dolencia_relacionada VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, en_revision, respondida, cerrada
    respuesta TEXT,
    terapeuta_id UUID REFERENCES auth.users(id), -- Opcional: ID del terapeuta que responde
    fecha_consulta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_respuesta TIMESTAMP WITH TIME ZONE,
    prioridad VARCHAR(20) DEFAULT 'normal', -- baja, normal, alta, urgente
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para guardar las dolencias favoritas/guardadas del usuario
CREATE TABLE IF NOT EXISTS dolencias_guardadas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dolencia_id UUID REFERENCES dolencias(id) ON DELETE CASCADE NOT NULL,
    notas_personales TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, dolencia_id) -- Un usuario no puede guardar la misma dolencia dos veces
);

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX IF NOT EXISTS idx_dolencias_nombre ON dolencias USING gin(to_tsvector('spanish', nombre));
CREATE INDEX IF NOT EXISTS idx_dolencias_descripcion ON dolencias USING gin(to_tsvector('spanish', descripcion));
CREATE INDEX IF NOT EXISTS idx_dolencias_categoria ON dolencias(categoria);
CREATE INDEX IF NOT EXISTS idx_progresos_usuario ON progresos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_consultas_usuario ON consultas_online(usuario_id);
CREATE INDEX IF NOT EXISTS idx_consultas_estado ON consultas_online(estado);

-- Configurar Row Level Security (RLS)
ALTER TABLE dolencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas_online ENABLE ROW LEVEL SECURITY;
ALTER TABLE dolencias_guardadas ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad

-- Dolencias: Lectura pública, escritura solo para administradores
CREATE POLICY "Dolencias son públicas para lectura" ON dolencias
    FOR SELECT USING (true);

CREATE POLICY "Solo administradores pueden modificar dolencias" ON dolencias
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Perfiles: Los usuarios solo pueden ver y editar su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil" ON perfiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON perfiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden insertar su propio perfil" ON perfiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Progresos: Los usuarios solo pueden ver y editar sus propios progresos
CREATE POLICY "Usuarios pueden ver sus propios progresos" ON progresos
    FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden insertar sus propios progresos" ON progresos
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus propios progresos" ON progresos
    FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus propios progresos" ON progresos
    FOR DELETE USING (auth.uid() = usuario_id);

-- Consultas online: Los usuarios solo pueden ver y crear sus propias consultas
CREATE POLICY "Usuarios pueden ver sus propias consultas" ON consultas_online
    FOR SELECT USING (auth.uid() = usuario_id OR auth.jwt() ->> 'role' = 'terapeuta');

CREATE POLICY "Usuarios pueden crear consultas" ON consultas_online
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus consultas" ON consultas_online
    FOR UPDATE USING (auth.uid() = usuario_id OR auth.jwt() ->> 'role' = 'terapeuta');

-- Dolencias guardadas: Los usuarios solo pueden ver y gestionar sus propias dolencias guardadas
CREATE POLICY "Usuarios pueden ver sus dolencias guardadas" ON dolencias_guardadas
    FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden guardar dolencias" ON dolencias_guardadas
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus dolencias guardadas" ON dolencias_guardadas
    FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus dolencias guardadas" ON dolencias_guardadas
    FOR DELETE USING (auth.uid() = usuario_id);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_dolencias_updated_at BEFORE UPDATE ON dolencias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_perfiles_updated_at BEFORE UPDATE ON perfiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progresos_updated_at BEFORE UPDATE ON progresos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultas_updated_at BEFORE UPDATE ON consultas_online
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunas dolencias de ejemplo (basadas en biodescodificación)
INSERT INTO dolencias (nombre, descripcion, categoria, palabras_clave) VALUES
('Dolor de cabeza', 'Conflicto de desvalorización intelectual. Miedo a no estar a la altura intelectualmente. Presión mental excesiva por querer controlar todo. La cabeza representa nuestro yo consciente y el control.', 'Sistema nervioso', ARRAY['cabeza', 'migraña', 'cefalea', 'tensión', 'estrés']),

('Asma', 'Sensación de asfixia en el territorio. Miedo a tomar su lugar en la vida. Conflicto con la madre o figura materna. Necesidad de espacio vital. Dificultad para expresar emociones.', 'Sistema respiratorio', ARRAY['respiración', 'ahogo', 'bronquios', 'pulmones', 'aire']),

('Gastritis', 'Rabia contenida que no se puede expresar. Algo que no se puede "digerir" emocionalmente. Cólera en el territorio familiar o laboral. Injusticia no asimilada.', 'Sistema digestivo', ARRAY['estómago', 'acidez', 'digestión', 'rabia', 'injusticia']),

('Dolor de espalda', 'Sentimiento de no sentirse apoyado por la familia o entorno. Carga excesiva de responsabilidades. Miedo al futuro. Desvalorización de uno mismo.', 'Sistema musculoesquelético', ARRAY['espalda', 'columna', 'apoyo', 'responsabilidad', 'carga']),

('Insomnio', 'Culpabilidad por algo que se ha hecho o dejado de hacer. Miedo a perder el control. Hipervigilancia emocional. Necesidad de estar alerta ante el peligro.', 'Sistema nervioso', ARRAY['sueño', 'dormir', 'descanso', 'vigilia', 'control']),

('Artritis', 'Rigidez mental y emocional. Crítica constante hacia uno mismo y hacia otros. Sensación de ser víctima. Resentimiento acumulado. Falta de flexibilidad ante los cambios.', 'Sistema musculoesquelético', ARRAY['articulaciones', 'rigidez', 'flexibilidad', 'crítica', 'resentimiento']),

('Hipertensión', 'Tensión emocional acumulada. Problemas no resueltos del pasado. Necesidad de control excesivo. Miedo a enfrentar conflictos. Presión por cumplir expectativas.', 'Sistema cardiovascular', ARRAY['presión', 'tensión', 'corazón', 'control', 'expectativas']),

('Depresión', 'Cólera dirigida hacia uno mismo. Sentimiento de desesperanza. Pérdida de la razón de vivir. Separación de algo o alguien querido. Desconexión del propósito de vida.', 'Sistema emocional', ARRAY['tristeza', 'desesperanza', 'pérdida', 'propósito', 'separación']),

('Ansiedad', 'Miedo al futuro y a lo desconocido. Pérdida de control sobre las circunstancias. Anticipación de peligros imaginarios. Necesidad de control y seguridad.', 'Sistema emocional', ARRAY['miedo', 'futuro', 'control', 'seguridad', 'nervios']),

('Diabetes', 'Tristeza profunda por no poder disfrutar de la dulzura de la vida. Necesidad de control sobre el entorno. Resistencia a recibir amor. Amargura acumulada.', 'Sistema endocrino', ARRAY['azúcar', 'dulzura', 'control', 'amargura', 'resistencia']);

-- Mensaje de confirmación
SELECT 'Base de datos configurada correctamente para la aplicación de biodescodificación' as mensaje;
