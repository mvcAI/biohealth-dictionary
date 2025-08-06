# 🔐 PASO 6: Probar Autenticación

## 📋 Verificar Sistema de Usuarios Completo

### 1. Acceder al Sistema de Autenticación

**En la aplicación:**

1. **Haz clic en "Iniciar sesión"** en la navegación
2. **Verifica que aparece el formulario** de autenticación
3. **El diseño debe ser holístico** (colores lilas, verdes, dorados)

### 2. Crear Nueva Cuenta

**Proceso de registro:**

1. **Haz clic en "Regístrate aquí"**
2. **Llena el formulario:**
   - **Nombre completo**: Tu nombre
   - **Email**: email@ejemplo.com
   - **Contraseña**: mínimo 6 caracteres
   - **Confirmar contraseña**: igual a la anterior
3. **Haz clic en "Crear cuenta"**

**Resultado esperado:**
✅ **Mensaje**: "¡Cuenta creada exitosamente! Revisa tu email..."
✅ **El formulario cambia** a modo "Iniciar sesión"

### 3. Verificar Email (Opcional en Desarrollo)

**En producción necesitarías:**
- Verificar tu email
- Hacer clic en el enlace de confirmación

**En desarrollo:**
- Puedes saltarte este paso
- La cuenta se crea pero necesita confirmación

### 4. Iniciar Sesión

**Con la cuenta creada:**

1. **Modo "Iniciar sesión" activo**
2. **Introduce:**
   - **Email**: el mismo email usado en registro
   - **Contraseña**: la misma contraseña
3. **Haz clic en "Iniciar sesión"**

**Resultado esperado:**
✅ **La aplicación redirige** a la página principal
✅ **La navegación muestra** tu email
✅ **Aparece botón** de "Cerrar sesión"
✅ **Se habilita** "Mi área"

### 5. Verificar Estado Autenticado

**Funcionalidades que deben activarse:**

1. **Navegación:**
   - ✅ Tu email visible en la barra superior
   - ✅ Botón "Mi área" habilitado
   - ✅ Botón "Consultas" habilitado
   - ✅ Botón "Cerrar sesión" visible

2. **Búsqueda de dolencias:**
   - ✅ Botón "Guardar en mi progreso" cambia a texto real
   - ✅ Búsquedas funcionan con datos de Supabase

3. **Mi área:**
   - ✅ Haz clic en "Mi área"
   - ✅ Debe cargar la página personal
   - ✅ Pestañas: "Dolencias Guardadas" y "Mi Progreso"

### 6. Probar Funcionalidades de Usuario

**Guardar una dolencia:**

1. **Busca una dolencia** (ej: "dolor de cabeza")
2. **Haz clic en "Guardar en mi progreso"**
3. **Debería aparecer** "Guardando..." y luego confirmar

**Ver área personal:**

1. **Ve a "Mi área"**
2. **Verifica pestañas** funcionando
3. **Dolencias guardadas** debe mostrar las que guardaste

### 7. Cerrar Sesión

**Proceso de logout:**

1. **Haz clic en el botón** de cerrar sesión (icono)
2. **La aplicación debe:**
   - ✅ Redirigir a la página principal
   - ✅ Mostrar "Iniciar sesión" en lugar del email
   - ✅ Ocultar "Mi área" y "Consultas"
   - ✅ Cambiar botones de guardar a "Iniciar sesión para guardar"

## 🔍 Checklist de Autenticación

### ✅ Registro de Usuario

- [ ] Formulario de registro aparece correctamente
- [ ] Validaciones funcionan (email, contraseña, confirmación)
- [ ] Mensajes de error claros y en español
- [ ] Mensaje de éxito al crear cuenta
- [ ] Redirección a formulario de login

### ✅ Inicio de Sesión

- [ ] Formulario de login funciona
- [ ] Validaciones de email y contraseña
- [ ] Mensajes de error amigables
- [ ] Login exitoso redirige a página principal
- [ ] Estado de autenticación se mantiene al recargar

### ✅ Estado Autenticado

- [ ] Email visible en navegación
- [ ] Botones de usuario habilitados
- [ ] "Mi área" accesible
- [ ] "Consultas" accesible
- [ ] Funciones de guardar activas

### ✅ Cierre de Sesión

- [ ] Botón de logout visible y funcional
- [ ] Estado se limpia correctamente
- [ ] Redirección a página pública
- [ ] Funciones privadas se deshabilitan

## 🚨 Solución de Problemas

### Error "Email not confirmed"

**Solución temporal para desarrollo:**
```sql
-- En Supabase SQL Editor
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'tu@email.com';
```

### Error "Invalid login credentials"

**Verificar:**
1. **Email y contraseña** escritos correctamente
2. **Cuenta creada exitosamente**
3. **Proyecto Supabase** configurado
4. **Variables de entorno** correctas

### Botones no cambian estado

**Verificar:**
1. **AuthContext** funcionando
2. **Usuario** correctamente autenticado
3. **Componentes** reciben props de autenticación

### "Mi área" no carga

**Verificar:**
1. **Políticas RLS** configuradas correctamente
2. **Usuario autenticado** tiene permisos
3. **Tablas** creadas correctamente

## 📊 Verificar en Supabase

**Ve a Authentication → Users en Supabase:**

- ✅ **Nuevo usuario** aparece en la lista
- ✅ **Email confirmed** = true (después de confirmar)
- ✅ **Last sign in** actualizado
- ✅ **UUID** generado automáticamente

---

🎯 **Siguiente Paso**: Probar búsquedas en tiempo real con datos de Supabase
