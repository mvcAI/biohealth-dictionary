# 📖 Cómo Procesar el PDF del Diccionario de Eric Corbera

## 🎯 Objetivo
Extraer todas las dolencias y sus interpretaciones del diccionario de Eric Corbera para integrarlas en la aplicación de biodescodificación.

## 📋 Pasos para procesar el PDF

### 1. Subir el PDF
- Arrastra y suelta el archivo PDF en el directorio raíz del proyecto
- Nombres recomendados: `diccionario.pdf`, `eric-corbera.pdf`, o `biodescodificacion.pdf`

### 2. Ejecutar el procesador
```bash
node procesarDiccionario.js
```

### 3. Archivos generados
El script creará automáticamente:
- `src/data/dolenciasCorberaExtraidas.json` - Datos para la aplicación
- `dolencias-corbera-insert.sql` - Script para insertar en Supabase

## 🔧 Funcionalidades del procesador

### Estrategias de extracción:
1. **Análisis línea por línea** - Detecta títulos seguidos de descripciones
2. **Patrones con dos puntos** - Encuentra "Dolencia: Descripción"
3. **Limpieza de texto** - Normaliza caracteres y formato
4. **Categorización automática** - Asigna dolencias a sistemas corporales
5. **Palabras clave** - Extrae términos relevantes para búsquedas
6. **Eliminación de duplicados** - Garantiza unicidad

### Categorías detectadas:
- Sistema nervioso
- Sistema respiratorio  
- Sistema digestivo
- Sistema cardiovascular
- Sistema musculoesquelético
- Sistema reproductivo
- Sistema endocrino
- Sistema inmunológico
- Piel
- Ojos
- Oídos
- Sistema urinario
- General

## 📊 Salida esperada

### JSON estructurado:
```json
[
  {
    "nombre": "Dolor de cabeza",
    "descripcion": "Conflicto de desvalorización intelectual...",
    "categoria": "Sistema nervioso",
    "palabras_clave": ["cabeza", "dolor", "tensión", "estrés"]
  }
]
```

### Script SQL:
```sql
INSERT INTO dolencias (nombre, descripcion, categoria, palabras_clave) VALUES
('Dolor de cabeza', 'Conflicto de...', 'Sistema nervioso', ARRAY['cabeza','dolor']),
-- ... más dolencias
```

## 🚀 Integración con la aplicación

Una vez procesado el PDF:

1. **Los datos JSON** se cargarán automáticamente en la aplicación
2. **El script SQL** se puede ejecutar en Supabase para poblar la base de datos
3. **La búsqueda** utilizará el contenido real del diccionario
4. **Las categorías** organizarán las dolencias por sistemas

## 🆘 Solución de problemas

### PDF no encontrado
- Verifica que el archivo esté en el directorio raíz
- Asegúrate de que tenga extensión `.pdf`

### Texto extraído vacío
- El PDF podría estar protegido o ser una imagen escaneada
- Intenta con un PDF que tenga texto seleccionable

### Pocas dolencias extraídas
- El formato del PDF podría ser diferente al esperado
- Revisa manualmente algunas páginas para entender la estructura

## 💡 Consejos

- **Calidad del PDF**: Asegúrate de que el texto sea seleccionable
- **Estructura**: El procesador funciona mejor con formatos consistentes
- **Revisión manual**: Siempre revisa los resultados antes de usar en producción
- **Backup**: Mantén una copia del PDF original

---

¡Una vez que tengas el PDF listo, simplemente ejecútalo y la aplicación tendrá acceso a todo el contenido del diccionario de Eric Corbera! 🎉
