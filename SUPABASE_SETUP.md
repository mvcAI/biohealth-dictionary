# Configuración de Supabase para la Aplicación de Biodescodificación

## Paso 1: Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Guarda las credenciales del proyecto

## Paso 2: Configurar variables de entorno

Actualiza el archivo `.env.local` con tus credenciales:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

## Paso 3: Ejecutar el script de configuración

1. Ve al **SQL Editor** en tu panel de Supabase
2. Copia y pega todo el contenido del archivo `supabase-setup.sql`
3. Ejecuta el script

## Estructura de la base de datos creada:

### Tablas principales:
- **dolencias**: Almacena la información del diccionario de Eric Corbera
- **perfiles**: Información adicional de los usuarios
- **progresos**: Seguimiento personal de cada usuario
- **consultas_online**: Solicitudes de consulta a expertos
- **dolencias_guardadas**: Dolencias favoritas de cada usuario

### Características de seguridad:
- **Row Level Security (RLS)** habilitado en todas las tablas
- **Políticas de seguridad** que garantizan que los usuarios solo accedan a sus propios datos
- **Autenticación** integrada con Supabase Auth

### Funcionalidades implementadas:
- **Búsqueda de texto completo** en dolencias (nombre, descripción, palabras clave)
- **Índices optimizados** para consultas rápidas
- **Triggers automáticos** para actualizar timestamps
- **Validaciones** de datos (ej: nivel de mejora 1-10)

## Paso 4: Verificar la instalación

Después de ejecutar el script, deberías ver:
- 5 tablas creadas
- Políticas RLS configuradas
- 10 dolencias de ejemplo insertadas
- Índices y triggers funcionando

## Uso en la aplicación

La aplicación ya está configurada para usar estas tablas a través del archivo `src/lib/database.js` que proporciona funciones para:

- Buscar dolencias
- Gestionar progreso personal
- Guardar dolencias favoritas
- Crear consultas online
- Autenticación de usuarios

¡Tu base de datos está lista para funcionar!
