# 🗄️ PASO 3: Ejecutar Script de Base de Datos

## 📋 Configurar las Tablas en Supabase

### 1. Abrir SQL Editor

1. **Ve a tu proyecto Supabase**
2. **Haz clic en "SQL Editor" en el menú lateral**
3. **Haz clic en "New Query"**

### 2. Ejecutar Script Principal

**Copia y pega el contenido completo del archivo `supabase-setup.sql`**

Este script creará:
- ✅ **5 tablas principales**
- ✅ **Políticas de seguridad (RLS)**
- ✅ **Índices optimizados**
- ✅ **Triggers automáticos**
- ✅ **10 dolencias de ejemplo**

### 3. Verificar Creación de Tablas

Después de ejecutar el script, verifica que se crearon las tablas:

```sql
-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Deberías ver:
- `dolencias`
- `perfiles`
- `progresos`
- `consultas_online`
- `dolencias_guardadas`

### 4. Verificar Datos de Ejemplo

```sql
-- Verificar dolencias insertadas
SELECT COUNT(*) as total_dolencias FROM dolencias;
SELECT nombre FROM dolencias LIMIT 5;
```

### 5. Habilitar Row Level Security

El script automáticamente habilita RLS, pero verifica:

```sql
-- Verificar RLS habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

## 🔧 Estructura de Tablas Creadas

### `dolencias`
- **id**: UUID (Primary Key)
- **nombre**: Nombre de la dolencia
- **descripcion**: Interpretación emocional
- **categoria**: Sistema corporal
- **palabras_clave**: Array para búsquedas

### `perfiles`
- **id**: UUID (Foreign Key a auth.users)
- **nombre_completo**: Nombre del usuario
- **email**: Email del usuario
- **telefono**: Teléfono (opcional)
- **fecha_nacimiento**: Fecha de nacimiento
- **objetivo_terapeutico**: Objetivo personal

### `progresos`
- **id**: UUID (Primary Key)
- **usuario_id**: Foreign Key a auth.users
- **dolencia_id**: Foreign Key a dolencias
- **nota_personal**: Notas del usuario
- **nivel_mejora**: Escala 1-10
- **estado**: activo/resuelto/en_proceso

### `consultas_online`
- **id**: UUID (Primary Key)
- **usuario_id**: Foreign Key a auth.users
- **mensaje**: Mensaje de consulta
- **estado**: pendiente/en_revision/respondida
- **respuesta**: Respuesta del experto
- **prioridad**: baja/normal/alta/urgente

### `dolencias_guardadas`
- **id**: UUID (Primary Key)
- **usuario_id**: Foreign Key a auth.users
- **dolencia_id**: Foreign Key a dolencias
- **notas_personales**: Notas del usuario

## ✅ Verificación Exitosa

Si todo funciona correctamente, deberías ver:
- ✅ 5 tablas creadas
- ✅ 10 dolencias de ejemplo insertadas
- ✅ RLS habilitado en todas las tablas
- ✅ Políticas de seguridad configuradas

## 🚨 Solución de Problemas

### Error de permisos
Si obtienes errores de permisos, asegúrate de:
- Estar logueado como propietario del proyecto
- Tener permisos de administrador

### Error de sintaxis SQL
- Copia el script completo sin modificaciones
- Ejecuta todo de una vez, no línea por línea

### Tablas no aparecen
- Actualiza la página de Supabase
- Verifica en la pestaña "Table Editor"

---

🎯 **Siguiente Paso**: Poblar con las 30 dolencias completas de biodescodificación
