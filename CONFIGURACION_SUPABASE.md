# 🚀 Configuración Completa de Supabase - Paso a Paso

## 📋 PASO 2: Configurar Proyecto Supabase

### 1. Crear Cuenta y Proyecto

1. **Ve a [supabase.com](https://supabase.com)**
2. **Crea una cuenta** (puedes usar GitHub, Google, etc.)
3. **Haz clic en "New Project"**
4. **Llena los datos:**
   - **Nombre del proyecto**: `biodescodificacion-app`
   - **Contraseña de base de datos**: (guarda esta contraseña segura)
   - **Región**: Elige la más cercana a tu ubicación
5. **Haz clic en "Create new project"**

⏳ *El proyecto tardará 1-2 minutos en crearse*

### 2. Obtener Credenciales

Una vez creado el proyecto:

1. **Ve a Settings > API**
2. **Copia estas credenciales:**
   - **Project URL**: `https://tuproyecto.supabase.co`
   - **anon public key**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJI...`

### 3. Configurar Variables de Entorno

Edita el archivo `.env.local` en el directorio raíz:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJI...
```

**⚠️ IMPORTANTE**: Reemplaza con tus credenciales reales

### 4. Verificar Conexión

Después de configurar las variables:

1. **Reinicia el servidor de desarrollo**
2. **Ve a la aplicación**
3. **El banner amarillo de "Modo Demo" debería desaparecer**
4. **La aplicación ahora conectará con Supabase**

## ✅ Verificación Rápida

Para verificar que todo está configurado:

```bash
# Reiniciar servidor
npm run dev
```

Si ves que el banner de "Modo Demo" desaparece, ¡Supabase está configurado correctamente!

## 🔄 Siguiente Paso

Una vez configurado Supabase, continuaremos con:
- **PASO 3**: Ejecutar script de base de datos
- **PASO 4**: Poblar con dolencias extraídas

---

💡 **¿Problemas?** Verifica que:
- Las URLs no tengan espacios o caracteres extra
- La clave anon key esté completa
- El archivo `.env.local` esté en la raíz del proyecto
- Hayas reiniciado el servidor después de cambiar variables
