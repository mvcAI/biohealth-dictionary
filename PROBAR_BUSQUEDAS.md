# 🔍 PASO 7: Probar Búsquedas en Tiempo Real

## 📋 Verificar Sistema de Búsqueda Completo

### 1. Acceder al Buscador

**En la página principal:**

1. **Localiza el buscador** en la sección principal
2. **Verifica que muestra** el placeholder: "Busca una dolencia... ej: dolor de cabeza, asma, gastritis"
3. **El diseño debe ser** holístico y atractivo

### 2. Probar Búsquedas por Nombre

**Pruebas específicas:**

```
Búsqueda: "dolor"
Resultados esperados:
✅ Dolor de cabeza
✅ Dolor de espalda  
✅ Dolor de rodillas
✅ Dolor de hombros
✅ Dolor de garganta
```

```
Búsqueda: "asma"
Resultado esperado:
✅ Asma (con descripción completa sobre territorio y madre)
```

```
Búsqueda: "gastritis"
Resultado esperado:
✅ Gastritis (con descripción sobre rabia contenida)
```

### 3. Probar Búsquedas por Descripción

**Pruebas de contenido emocional:**

```
Búsqueda: "miedo"
Resultados esperados:
✅ Dolencias que contengan "miedo" en descripción
✅ Ej: Ansiedad, Dolor de rodillas, Vértigo, etc.
```

```
Búsqueda: "rabia"
Resultados esperados:
✅ Gastritis
✅ Dolor de garganta
✅ Otitis
```

```
Búsqueda: "control"
Resultados esperados:
✅ Dolor de cabeza
✅ Insomnio
✅ Ansiedad
✅ Diabetes
✅ Hipertensi��n
```

### 4. Probar Búsquedas por Palabras Clave

**Búsquedas optimizadas:**

```
Búsqueda: "separación"
Resultados esperados:
✅ Eczema
✅ Depresión
✅ Alopecia
```

```
Búsqueda: "territorio"
Resultados esperados:
✅ Asma
✅ Cistitis
✅ Hemorroides
```

### 5. Verificar Búsqueda en Tiempo Real

**Funcionalidad de debounce:**

1. **Escribe lentamente** "dol"
2. **Debe esperar** 300ms antes de buscar
3. **Continúa con** "dolor"
4. **Los resultados** se actualizan automáticamente
5. **Indicador de carga** aparece brevemente

### 6. Probar Categorías

**Búsquedas por sistema:**

```
Búsqueda: "musculo" o "esquelético"
Resultados esperados:
✅ 6 dolencias del sistema musculoesquelético
```

```
Búsqueda: "respiratorio"
Resultados esperados:
✅ Asma
✅ Dolor de garganta
✅ Sinusitis
```

```
Búsqueda: "piel"
Resultados esperados:
✅ Eczema
✅ Herpes labial
✅ Alopecia
✅ Acné
```

### 7. Verificar Presentación de Resultados

**Cada resultado debe mostrar:**

- ✅ **Nombre de la dolencia** (como título)
- ✅ **Categoría** (como tag coloreado)
- ✅ **Descripción completa** (interpretación emocional)
- ✅ **Botón "Guardar"** (funcional si estás autenticado)
- ✅ **Diseño atractivo** con bordes y sombras

### 8. Probar Estados Especiales

**Búsqueda vacía:**
```
Búsqueda: ""
Resultado esperado:
✅ No se muestran resultados
✅ Sección de resultados oculta
```

**Búsqueda sin resultados:**
```
Búsqueda: "xyz123"
Resultado esperado:
✅ Mensaje: "No se encontraron resultados"
✅ O simplemente no mostrar resultados
```

**Búsqueda con carga:**
```
Búsqueda: cualquier término
Resultado esperado:
✅ Icono de carga (spinning)
✅ Duración breve (300-500ms)
```

## 🔍 Checklist de Búsquedas

### ✅ Funcionalidad Básica

- [ ] Buscador aparece y es accesible
- [ ] Placeholder text correcto
- [ ] Búsqueda en tiempo real (debounce)
- [ ] Indicador de carga funcional

### ✅ Búsquedas por Nombre

- [ ] "dolor" encuentra 5 dolencias
- [ ] "asma" encuentra resultado específico
- [ ] "diabetes" encuentra resultado específico
- [ ] Coincidencias parciales funcionan

### ✅ Búsquedas por Descripción

- [ ] "miedo" encuentra múltiples resultados
- [ ] "rabia" encuentra dolencias relacionadas
- [ ] "control" encuentra múltiples resultados
- [ ] Búsquedas emocionales funcionan

### ✅ Búsquedas por Palabras Clave

- [ ] "separación" encuentra resultados correctos
- [ ] "territorio" encuentra dolencias relacionadas
- [ ] Palabras clave optimizan búsquedas

### ✅ Presentación de Resultados

- [ ] Diseño atractivo y legible
- [ ] Categorías mostradas como tags
- [ ] Descripciones completas visibles
- [ ] Botones de acción funcionan

### ✅ Estados y Edge Cases

- [ ] Búsqueda vacía no muestra resultados
- [ ] Búsquedas sin resultados manejadas
- [ ] Estados de carga apropiados
- [ ] Performance buena (respuesta rápida)

## 🚨 Solución de Problemas

### No aparecen resultados

**Verificar:**
1. **Variables de entorno** configuradas correctamente
2. **Dolencias insertadas** en Supabase (ver PASO 4)
3. **Políticas RLS** permiten lectura pública
4. **Conexión a internet** funcional

### Búsquedas muy lentas

**Optimizar:**
```sql
-- Verificar índices en Supabase
SELECT indexname FROM pg_indexes 
WHERE tablename = 'dolencias';
```

### Error de búsqueda

**Verificar en consola:**
1. **F12 → Console**
2. **Buscar errores** de Supabase
3. **Verificar** que las consultas SQL funcionan

### Resultados incorrectos

**Verificar datos:**
```sql
-- En Supabase SQL Editor
SELECT nombre, descripcion 
FROM dolencias 
WHERE nombre ILIKE '%dolor%';
```

## 📊 Estadísticas Esperadas

**Total de dolencias**: 30
**Distribución por búsquedas comunes:**

- "dolor": ~5 resultados
- "miedo": ~7 resultados  
- "rabia": ~3 resultados
- "control": ~5 resultados
- "separación": ~3 resultados

## 🎯 Búsquedas de Prueba Recomendadas

**Para probar completamente:**

1. **"dolor de cabeza"** → resultado exacto
2. **"estrés"** → múltiples resultados
3. **"emocional"** → resultados de descripción
4. **"piel"** → resultados por categoría
5. **"territorio"** → resultados por palabra clave
6. **"sistema nervioso"** → resultados por categoría
7. **"madre"** → búsqueda específica (asma)
8. **"xyz123"** → sin resultados

---

🎯 **Siguiente Paso**: Probar área personal y progreso del usuario
