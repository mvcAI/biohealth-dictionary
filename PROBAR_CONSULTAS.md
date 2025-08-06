# 💬 PASO 9: Probar Consultas Online

## 📋 Verificar Sistema de Consultas a Expertos

### 1. Acceder a Consultas Online

**Desde la navegación:**
1. **Usuario autenticado** (si no, aparece página de login)
2. **Haz clic en "Consultas"** en la navegación
3. **Verifica carga** de la página de consultas

**Sin autenticación:**
- ✅ **Página especial** pidiendo iniciar sesión
- ✅ **Botón "Iniciar sesión"** funcional
- ✅ **Mensaje explicativo** sobre consultas

### 2. Crear Primera Consulta

**Proceso:**

1. **Haz clic** "Nueva consulta" o "Enviar primera consulta"
2. **Aparece formulario** completo de consulta
3. **Completa los campos:**

**Campos del formulario:**
- **Dolencia relacionada** (opcional): "Dolor de cabeza"
- **Prioridad**: Normal / Alta / Baja / Urgente
- **Tu consulta** (obligatorio): Mensaje detallado

**Ejemplo de consulta:**
```
Dolencia: Dolor de cabeza
Prioridad: Normal
Mensaje: "Hola, tengo dolores de cabeza frecuentes especialmente cuando estoy en el trabajo. He leído que puede estar relacionado con el control excesivo. ¿Podrían ayudarme a entender mejor esta conexión y qué ejercicios emocionales puedo hacer?"
```

4. **Haz clic "Enviar consulta"**

### 3. Verificar Envío Exitoso

**Después del envío:**
- ✅ **Mensaje de confirmación**: "Consulta enviada exitosamente..."
- ✅ **Formulario se cierra**
- ✅ **Lista se actualiza** con la nueva consulta
- ✅ **Estado "Pendiente"** visible

### 4. Probar Múltiples Consultas

**Crear consultas adicionales:**

**Consulta 2:**
```
Dolencia: Ansiedad
Prioridad: Alta
Mensaje: "Experimento mucha ansiedad antes de situaciones importantes. ¿Cómo puedo trabajar el miedo al futuro desde la biodescodificación?"
```

**Consulta 3:**
```
Dolencia: (vacío)
Prioridad: Baja
Mensaje: "¿Podrían recomendarme recursos para comenzar mi trabajo de autoconocimiento emocional?"
```

### 5. Verificar Lista de Consultas

**Funcionalidades de la lista:**

**Información mostrada:**
- ✅ **Estado visual** con iconos coloreados
- ✅ **Prioridad** como badge coloreado
- ✅ **Fecha de consulta**
- ✅ **Dolencia relacionada** (si aplica)
- ✅ **Mensaje completo** visible

**Estados de consulta:**
- 🟡 **Pendiente** (Clock icon, amarillo)
- 🔵 **En revisión** (AlertCircle icon, azul)
- 🟢 **Respondida** (CheckCircle icon, verde)
- ⚫ **Cerrada** (estado final)

**Prioridades con colores:**
- 🟢 **Baja** (verde)
- ⚪ **Normal** (gris)
- 🟡 **Alta** (amarillo)
- 🔴 **Urgente** (rojo)

### 6. Simular Respuesta de Experto

**Para testing completo (simulación en Supabase):**

```sql
-- En Supabase SQL Editor, simular respuesta
UPDATE consultas_online 
SET 
  estado = 'respondida',
  respuesta = 'Gracias por tu consulta. El dolor de cabeza efectivamente está relacionado con el control excesivo y la presión mental. Te recomiendo trabajar la relajación consciente y la confianza en el proceso de la vida. Practica ejercicios de respiración cuando sientas la necesidad de controlar.',
  fecha_respuesta = NOW()
WHERE mensaje ILIKE '%dolor de cabeza%'
AND usuario_id = 'tu-usuario-id';
```

### 7. Verificar Consulta Respondida

**Después de simular respuesta:**

1. **Recarga la página** de consultas
2. **Verifica cambios:**
   - ✅ **Estado** cambia a "Respondida" (verde)
   - ✅ **Sección "Respuesta del experto"** aparece
   - ✅ **Fecha de respuesta** mostrada
   - ✅ **Mensaje de respuesta** completo visible

### 8. Probar Estados Especiales

**Lista vacía:**
- ✅ **Mensaje**: "No tienes consultas"
- ✅ **Ícono ilustrativo**
- ✅ **Botón**: "Enviar primera consulta"

**Formulario con errores:**
- ✅ **Campo mensaje vacío** → Error apropiado
- ✅ **Validaciones** funcionando
- ✅ **Mensajes** en español

### 9. Probar Responsiveness

**En móviles:**
- ✅ **Formulario adaptado** a pantalla pequeña
- ✅ **Lista legible** en móvil
- ✅ **Botones accesibles**
- ✅ **Menú móvil** incluye "Consultas"

## 🔍 Checklist Completo

### ✅ Acceso y Navegación

- [ ] "Consultas" accesible desde navegación
- [ ] Página de login para usuarios no autenticados
- [ ] Carga correcta para usuarios autenticados
- [ ] Diseño holístico consistente

### ✅ Formulario de Nueva Consulta

- [ ] Botón "Nueva consulta" visible y funcional
- [ ] Formulario completo con todos los campos
- [ ] Campo "Dolencia relacionada" opcional
- [ ] Selector de prioridad funcional
- [ ] Campo mensaje obligatorio con validación
- [ ] Botones "Enviar" y "Cancelar" funcionan

### ✅ Envío y Confirmación

- [ ] Envío exitoso muestra confirmación
- [ ] Formulario se cierra automáticamente
- [ ] Lista se actualiza con nueva consulta
- [ ] Estado inicial "Pendiente" correcto

### ✅ Lista de Consultas

- [ ] Consultas mostradas cronológicamente
- [ ] Estados visuales con iconos apropiados
- [ ] Prioridades con colores correctos
- [ ] Información completa visible
- [ ] Diseño atractivo y legible

### ✅ Respuestas de Expertos

- [ ] Consultas respondidas muestran respuesta
- [ ] Fecha de respuesta visible
- [ ] Estado cambia a "Respondida"
- [ ] Formato de respuesta atractivo

### ✅ Estados y Edge Cases

- [ ] Lista vacía manejada apropiadamente
- [ ] Validaciones de formulario funcionan
- [ ] Estados de carga apropiados
- [ ] Mensajes de error claros

## 🚨 Solución de Problemas

### Página de consultas no carga

**Verificar:**
1. **Usuario autenticado**
2. **Tabla `consultas_online`** creada
3. **Políticas RLS** configuradas
4. **Variables de entorno** correctas

### No se pueden enviar consultas

**Verificar:**
1. **Formulario validation** funcional
2. **Supabase connection** activa
3. **Permisos de inserción** en RLS
4. **Campos obligatorios** completados

### Consultas no aparecen

**Verificar en Supabase:**
```sql
-- Ver consultas del usuario
SELECT * FROM consultas_online 
WHERE usuario_id = 'tu-usuario-uuid'
ORDER BY created_at DESC;
```

### Estados incorrectos

**Verificar:**
1. **Valores enum** correctos en base de datos
2. **Lógica de estados** en componente
3. **Iconos y colores** mapeados correctamente

## 🔧 Testing en Supabase

**Para simular respuestas de expertos:**

```sql
-- Cambiar estado a "en revisión"
UPDATE consultas_online 
SET estado = 'en_revision' 
WHERE id = 'consulta-uuid';

-- Agregar respuesta completa
UPDATE consultas_online 
SET 
  estado = 'respondida',
  respuesta = 'Tu mensaje de respuesta aquí...',
  fecha_respuesta = NOW()
WHERE id = 'consulta-uuid';

-- Ver todas las consultas y estados
SELECT 
  mensaje, 
  estado, 
  prioridad, 
  created_at,
  respuesta IS NOT NULL as tiene_respuesta
FROM consultas_online 
ORDER BY created_at DESC;
```

## 📊 Flujo Completo de Prueba

**Secuencia recomendada:**

1. **Acceder sin autenticación** → Ver página de login
2. **Iniciar sesión** → Acceder a consultas
3. **Ver estado vacío** → Botón primera consulta
4. **Crear consulta 1** → Dolor de cabeza, Normal
5. **Verificar** consulta en lista (Pendiente)
6. **Crear consulta 2** → Ansiedad, Alta
7. **Crear consulta 3** → General, Baja
8. **Simular respuesta** en Supabase para consulta 1
9. **Recargar** y verificar respuesta mostrada
10. **Probar en móvil** → Responsive design

---

🎯 **Último Paso**: Crear commit final y preparar para producción
