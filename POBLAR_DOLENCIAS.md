# 💾 PASO 4: Poblar Base de Datos con Dolencias Completas

## 📋 Insertar las 30 Dolencias de Biodescodificación

### 1. Abrir SQL Editor en Supabase

1. **Ve a tu proyecto Supabase**
2. **Haz clic en "SQL Editor"**
3. **Crea una nueva query**

### 2. Ejecutar Script de Dolencias

**Copia y pega el contenido completo del archivo `dolencias-insert.sql`**

Este script:
- ✅ **Limpia dolencias anteriores** (mantiene solo placeholder)
- ✅ **Inserta 30 dolencias completas** basadas en biodescodificación
- ✅ **Incluye categorías organizadas** por sistemas corporales
- ✅ **Agrega palabras clave** para búsquedas optimizadas
- ✅ **Verifica la inserción** con consultas de control

### 3. Verificar Inserción Exitosa

Después de ejecutar el script, deberías ver:

```sql
-- Resultado esperado:
total_dolencias: 30

-- Distribución por categorías:
Sistema musculoesquelético: 6
Sistema respiratorio: 3
Piel: 4
Sistema digestivo: 3
Oídos: 3
Sistema nervioso: 2
Sistema emocional: 2
Sistema endocrino: 2
Sistema urinario: 2
Sistema cardiovascular: 1
Sistema reproductivo: 1
Ojos: 1
```

### 4. Probar Búsquedas

Verifica que las búsquedas funcionen:

```sql
-- Buscar por nombre
SELECT nombre, categoria 
FROM dolencias 
WHERE nombre ILIKE '%dolor%' 
LIMIT 5;

-- Buscar por descripción
SELECT nombre, categoria 
FROM dolencias 
WHERE descripcion ILIKE '%miedo%' 
LIMIT 5;

-- Buscar por palabras clave
SELECT nombre, categoria 
FROM dolencias 
WHERE 'control' = ANY(palabras_clave) 
LIMIT 5;
```

### 5. Verificar Categorías

```sql
-- Ver todas las categorías disponibles
SELECT categoria, COUNT(*) as cantidad 
FROM dolencias 
GROUP BY categoria 
ORDER BY cantidad DESC;
```

## 🔍 Dolencias Incluidas

### **Sistema Musculoesquelético (6)**
- Dolor de espalda
- Artritis  
- Dolor de rodillas
- Dolor de hombros
- Fibromialgia
- Lumbalgia

### **Sistema Respiratorio (3)**
- Asma
- Dolor de garganta
- Sinusitis

### **Piel (4)**
- Eczema
- Herpes labial
- Alopecia
- Acné

### **Sistema Digestivo (3)**
- Gastritis
- Colon irritable
- Hemorroides

### **Oídos (3)**
- Otitis
- Vértigo
- Tinnitus

### **Sistema Nervioso (2)**
- Dolor de cabeza
- Insomnio

### **Sistema Emocional (2)**
- Depresión
- Ansiedad

### **Sistema Endocrino (2)**
- Diabetes
- Hipotiroidismo

### **Sistema Urinario (2)**
- Cistitis
- Cálculos renales

### **Otros Sistemas (3)**
- Hipertensión (Cardiovascular)
- Cáncer de mama (Reproductivo)
- Conjuntivitis (Ojos)

## ✅ Verificación Final

Para confirmar que todo está correcto:

1. **Total de dolencias**: 30
2. **Todas las categorías** representadas
3. **Búsquedas funcionando** por nombre, descripción y palabras clave
4. **Sin errores** en la ejecución del script

## 🚨 Solución de Problemas

### Error de duplicados
Si obtienes errores de clave duplicada:
```sql
-- Limpiar completamente y volver a insertar
DELETE FROM dolencias;
-- Luego ejecuta el script dolencias-insert.sql
```

### Búsquedas no funcionan
Verifica que los índices estén creados:
```sql
-- Ver índices existentes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename = 'dolencias';
```

### Caracteres raros
Si ves caracteres extraños, verifica que la codificación sea UTF-8

---

🎯 **Siguiente Paso**: Configurar variables de entorno en la aplicación
