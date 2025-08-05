// Script para procesar el PDF de Eric Corbera y extraer las dolencias
// Para usar este script, instala: npm install pdf-parse

import fs from 'fs'
import path from 'path'

// Función para procesar texto extraído del PDF
function procesarTextoPDF(textoCompleto) {
  const dolencias = []
  
  // Patterns comunes en diccionarios de biodescodificación
  const patrones = [
    // Patrón 1: Nombre de dolencia seguido de descripción
    /([A-ZÁÉÍÓÚ][a-záéíóúñ\s]+):\s*([^A-ZÁÉÍÓÚ]*?)(?=[A-ZÁÉÍÓÚ][a-záéíóúñ\s]+:|$)/g,
    
    // Patrón 2: Dolencia en mayúsculas
    /([A-ZÁ��ÍÓÚ\s]{2,})[\n\r]\s*([^A-ZÁÉÍÓÚ]*?)(?=[A-ZÁÉÍÓÚ\s]{2,}[\n\r]|$)/g,
    
    // Patrón 3: Con números o bullets
    /\d+[\.\)]\s*([A-Za-záéíóúñ\s]+)[\:\-]\s*([^0-9]*?)(?=\d+[\.\)]|$)/g
  ]
  
  let matches = []
  
  // Intentar todos los patrones
  patrones.forEach(patron => {
    let match
    while ((match = patron.exec(textoCompleto)) !== null) {
      matches.push({
        nombre: match[1].trim(),
        descripcion: match[2].trim()
      })
    }
  })
  
  // Limpiar y procesar matches
  matches.forEach(match => {
    const nombre = limpiarTexto(match.nombre)
    const descripcion = limpiarTexto(match.descripcion)
    
    // Validar que sean válidos
    if (nombre.length > 2 && descripcion.length > 10) {
      const categoria = determinarCategoria(nombre)
      const palabrasClave = extraerPalabrasClave(nombre, descripcion)
      
      dolencias.push({
        nombre,
        descripcion,
        categoria,
        palabras_clave: palabrasClave
      })
    }
  })
  
  // Eliminar duplicados
  const dolenciasUnicas = eliminarDuplicados(dolencias)
  
  return dolenciasUnicas
}

function limpiarTexto(texto) {
  return texto
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ\.\,\;\:\-]/g, '')
    .trim()
}

function determinarCategoria(nombre) {
  const categorias = {
    'Sistema nervioso': ['cabeza', 'cerebro', 'nervio', 'ansiedad', 'depresión', 'estrés', 'insomnio'],
    'Sistema respiratorio': ['pulmón', 'bronquio', 'asma', 'respiración', 'aire', 'ahogo'],
    'Sistema digestivo': ['estómago', 'intestino', 'hígado', 'gastritis', 'digestión', 'náusea'],
    'Sistema cardiovascular': ['corazón', 'sangre', 'presión', 'circulación', 'arterias'],
    'Sistema musculoesquelético': ['hueso', 'músculo', 'articulación', 'espalda', 'columna', 'artritis'],
    'Sistema reproductivo': ['útero', 'ovario', 'próstata', 'menstruación', 'fertilidad'],
    'Sistema endocrino': ['tiroides', 'diabetes', 'hormona', 'glándula'],
    'Sistema inmunológico': ['alergia', 'autoimmune', 'defensas', 'infección'],
    'Piel': ['dermatitis', 'eczema', 'psoriasis', 'acné', 'piel'],
    'Ojos': ['vista', 'ojo', 'miopía', 'catarata', 'glaucoma'],
    'Oídos': ['oído', 'sordera', 'tinnitus', 'audición'],
    'Sistema emocional': ['emocional', 'psicológico', 'mental', 'trauma']
  }
  
  const nombreLower = nombre.toLowerCase()
  
  for (const [categoria, palabras] of Object.entries(categorias)) {
    if (palabras.some(palabra => nombreLower.includes(palabra))) {
      return categoria
    }
  }
  
  return 'General'
}

function extraerPalabrasClave(nombre, descripcion) {
  const texto = `${nombre} ${descripcion}`.toLowerCase()
  const palabrasComunes = ['el', 'la', 'de', 'del', 'en', 'y', 'a', 'que', 'con', 'por', 'para', 'un', 'una']
  
  const palabras = texto
    .split(/\s+/)
    .filter(palabra => palabra.length > 3)
    .filter(palabra => !palabrasComunes.includes(palabra))
    .filter(palabra => /^[a-záéíóúñü]+$/.test(palabra))
  
  // Obtener palabras únicas y más relevantes
  const frecuencia = {}
  palabras.forEach(palabra => {
    frecuencia[palabra] = (frecuencia[palabra] || 0) + 1
  })
  
  return Object.keys(frecuencia)
    .sort((a, b) => frecuencia[b] - frecuencia[a])
    .slice(0, 8) // Top 8 palabras clave
}

function eliminarDuplicados(dolencias) {
  const vistas = new Set()
  return dolencias.filter(dolencia => {
    const key = dolencia.nombre.toLowerCase()
    if (vistas.has(key)) {
      return false
    }
    vistas.add(key)
    return true
  })
}

// Función principal para usar cuando tengas el PDF
export async function procesarPDFDiccionario(rutaPDF) {
  try {
    // Nota: Necesitarás instalar pdf-parse: npm install pdf-parse
    const pdfParse = await import('pdf-parse')
    
    const dataBuffer = fs.readFileSync(rutaPDF)
    const data = await pdfParse.default(dataBuffer)
    
    console.log('Procesando PDF...')
    console.log(`Páginas: ${data.numpages}`)
    console.log(`Texto extraído: ${data.text.length} caracteres`)
    
    const dolencias = procesarTextoPDF(data.text)
    
    // Guardar resultado en JSON
    const outputPath = 'src/data/dolenciasExtraidas.json'
    fs.writeFileSync(outputPath, JSON.stringify(dolencias, null, 2), 'utf8')
    
    console.log(`✅ Procesado completado: ${dolencias.length} dolencias extraídas`)
    console.log(`📁 Guardado en: ${outputPath}`)
    
    return dolencias
    
  } catch (error) {
    console.error('Error procesando PDF:', error)
    throw error
  }
}

// Función para crear script SQL de inserción
export function generarScriptSQL(dolencias) {
  let sql = `-- Dolencias extraídas del diccionario de Eric Corbera
-- Ejecutar este script en Supabase SQL Editor

INSERT INTO dolencias (nombre, descripcion, categoria, palabras_clave) VALUES\n`

  const valores = dolencias.map(dolencia => {
    const nombre = dolencia.nombre.replace(/'/g, "''")
    const descripcion = dolencia.descripcion.replace(/'/g, "''")
    const categoria = dolencia.categoria.replace(/'/g, "''")
    const palabrasClave = dolencia.palabras_clave.map(p => p.replace(/'/g, "''")).join('","')
    
    return `('${nombre}', '${descripcion}', '${categoria}', ARRAY['${palabrasClave}'])`
  }).join(',\n')

  sql += valores + ';\n'
  
  return sql
}

// Instrucciones para usar este script
console.log(`
📖 INSTRUCCIONES PARA PROCESAR EL PDF:

1. Coloca el PDF del diccionario de Eric Corbera en la carpeta raíz del proyecto
2. Instala la dependencia: npm install pdf-parse
3. Ejecuta el script:
   
   import { procesarPDFDiccionario } from './scripts/procesarPDF.js'
   const dolencias = await procesarPDFDiccionario('./diccionario.pdf')

4. El script generará:
   - src/data/dolenciasExtraidas.json (datos para la app)
   - Script SQL para insertar en Supabase

💡 NOTA: Si el PDF tiene un formato específico, es posible que necesite
ajustar los patrones de regex en la función procesarTextoPDF()
`)
