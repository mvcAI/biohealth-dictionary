# ���� PASO 5: Configurar Variables de Entorno

## 📋 Conectar la Aplicación con Supabase

### 1. Obtener Credenciales de Supabase

**En tu proyecto Supabase:**

1. **Ve a Settings → API**
2. **Copia estos valores:**
   - **Project URL**: `https://abcdefgh.supabase.co`
   - **anon public**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJI...`

### 2. Actualizar Archivo .env.local

**Edita el archivo `.env.local` en la raíz del proyecto:**

```env
# Supabase Configuration
# Reemplaza con tus credenciales reales
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJI...
```

### 3. Reiniciar Servidor de Desarrollo

**Importante**: Después de cambiar variables de entorno, siempre reinicia:

```bash
# Detener servidor (Ctrl+C)
# Luego reiniciar
npm run dev
```

### 4. Verificar Conexión

**Señales de conexión exitosa:**

✅ **El banner amarillo de "Modo Demo" desaparece**
✅ **No hay errores de console relacionados con Supabase**
✅ **La aplicación carga normalmente**

### 5. Verificar en Consola del Navegador

**Abre DevTools (F12) y verifica:**

- **No debe haber errores de "Invalid URL"**
- **No debe haber errores de Supabase**
- **La aplicación debería mostrar "Supabase configurado"**

## 🔍 Checklist de Verificación

### ✅ Variables Configuradas Correctamente

- [ ] `VITE_SUPABASE_URL` contiene URL real (no placeholder)
- [ ] `VITE_SUPABASE_ANON_KEY` contiene clave real (no placeholder)
- [ ] No hay espacios extra al inicio o final
- [ ] Las comillas están bien cerradas

### ✅ Aplicación Conectada

- [ ] Banner de "Modo Demo" no aparece
- [ ] No hay errores en consola del navegador
- [ ] Aplicación carga sin problemas
- [ ] Buscador está activo

### ✅ Servidor Reiniciado

- [ ] Servidor detenido completamente
- [ ] Variables actualizadas en `.env.local`
- [ ] Servidor reiniciado con `npm run dev`

## 🚨 Solución de Problemas

### Banner de "Modo Demo" sigue apareciendo

**Posibles causas:**
1. **Variables no actualizadas**: Verifica que reemplazaste los placeholders
2. **Servidor no reiniciado**: Mata el proceso y reinicia
3. **URL incorrecta**: Verifica que sea exactamente como en Supabase
4. **Clave incorrecta**: Verifica que copiaste la clave anon completa

### Error "Invalid URL" en consola

**Solución:**
```env
# INCORRECTO:
VITE_SUPABASE_URL=your_supabase_project_url

# CORRECTO:
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
```

### Aplicación no carga

**Verifica:**
1. **Sintaxis del archivo .env.local** (sin espacios extra)
2. **Proyecto Supabase activo** (no pausado)
3. **Red de internet** funcionando

### Variables no se cargan

**Solución:**
```bash
# Limpiar caché y reiniciar
rm -rf node_modules/.vite
npm run dev
```

## 📝 Ejemplo Completo

**Archivo `.env.local` correcto:**

```env
# Supabase Configuration
# Proyecto: biodescodificacion-app
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2ODQwMCwiZXhwIjoyMDE0MzQ0NDAwfQ.example_token_signature_here
```

## ✅ Verificación Final

Una vez configurado correctamente:

1. **La aplicación carga sin errores**
2. **No aparece banner de "Modo Demo"**
3. **El buscador debería funcionar con datos reales**
4. **Los botones de autenticación están activos**

---

🎯 **Siguiente Paso**: Probar autenticación de usuarios
