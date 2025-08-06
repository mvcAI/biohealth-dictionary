#!/usr/bin/env node

// Script para procesar el PDF del diccionario de Eric Corbera
import fs from 'fs'
import path from 'path'
import pdfParse from 'pdf-parse'

// Buscar el PDF en el directorio
async function encontrarPDF() {
  const posiblesNombres = [
    'diccionario.pdf',
    'eric-corbera.pdf',
    'biodescodificacion.pdf',
    'corbera.pdf',
    'diccionario-corbera.pdf'
  ]
  
  for (const nombre of posiblesNombres) {
    if (fs.existsSync(nombre)) {
      return nombre
    }
  }
  
  // Buscar cualquier PDF en el directorio
  const archivos = fs.readdirSync('.')
  const pdfs = archivos.filter(archivo => archivo.toLowerCase().endsWith('.pdf'))
  
  if (pdfs.length === 1) {
    console.log(`📁 Encontrado PDF: ${pdfs[0]}`)
    return pdfs[0]
  } else if (pdfs.length > 1) {
    console.log(`📁 Encontrados múltiples PDFs: ${pdfs.join(', ')}`)
    console.log(`📁 Usando el primero: ${pdfs[0]}`)
    return pdfs[0]
  }
  
  return null
}

function limpiarTexto(texto) {
  return texto
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ\.\,\;\:\-\(\)]/g, '')
    .trim()
}

function determinarCategoria(nombre) {
  const nombreLower = nombre.toLowerCase()
  
  const categorias = {
    'Sistema nervioso': [
      'cabeza', 'cerebro', 'nervio', 'ansiedad', 'depresión', 'estrés', 'insomnio',
      'migraña', 'cefalea', 'neuralgia', 'neurosis', 'pánico', 'fobia'
    ],
    'Sistema respiratorio': [
      'pulmón', 'bronquio', 'asma', 'respiración', 'aire', 'ahogo', 'tos',
      'garganta', 'laringe', 'tráquea', 'sinusitis', 'rinitis'
    ],
    'Sistema digestivo': [
      'estómago', 'intestino', 'hígado', 'gastritis', 'digestión', 'náusea',
      'colón', 'diarrea', 'estreñimiento', 'vesícula', 'páncreas', 'boca'
    ],
    'Sistema cardiovascular': [
      'corazón', 'sangre', 'presión', 'circulación', 'arterias', 'venas',
      'hipertensión', 'taquicardia', 'arritmia', 'infarto'
    ],
    'Sistema musculoesquelético': [
      'hueso', 'músculo', 'articulación', 'espalda', 'columna', 'artritis',
      'rodilla', 'hombro', 'cuello', 'pierna', 'brazo', 'mano', 'pie'
    ],
    'Sistema reproductivo': [
      'útero', 'ovario', 'próstata', 'menstruación', 'fertilidad', 'vagina',
      'testículo', 'pene', 'mama', 'seno', 'embarazo'
    ],
    'Sistema endocrino': [
      'tiroides', 'diabetes', 'hormona', 'glándula', 'suprarrenal',
      'pituitaria', 'insulina', 'metabolismo'
    ],
    'Sistema inmunológico': [
      'alergia', 'autoimmune', 'defensas', 'infección', 'fiebre',
      'inflamación', 'lupus', 'artritis'
    ],
    'Piel': [
      'dermatitis', 'eczema', 'psoriasis', 'acné', 'piel', 'cutáneo',
      'erupción', 'urticaria', 'vitíligo'
    ],
    'Ojos': [
      'vista', 'ojo', 'miopía', 'catarata', 'glaucoma', 'retina',
      'córnea', 'conjuntivitis', 'visión'
    ],
    'Oídos': [
      'oído', 'sordera', 'tinnitus', 'audición', 'otitis', 'vértigo',
      'mareo', 'equilibrio'
    ],
    'Sistema urinario': [
      'riñón', 'vejiga', 'orina', 'cistitis', 'nefritis', 'incontinencia',
      'próstata', 'uretra'
    ]
  }
  
  for (const [categoria, palabras] of Object.entries(categorias)) {
    if (palabras.some(palabra => nombreLower.includes(palabra))) {
      return categoria
    }
  }
  
  return 'General'
}

function extraerPalabrasClave(nombre, descripcion) {
  const texto = `${nombre} ${descripcion}`.toLowerCase()
  const palabrasComunes = [
    'el', 'la', 'de', 'del', 'en', 'y', 'a', 'que', 'con', 'por', 'para', 'un', 'una',
    'es', 'se', 'no', 'te', 'me', 'lo', 'le', 'su', 'mi', 'tu', 'nos', 'les', 'los',
    'las', 'este', 'esta', 'ese', 'esa', 'aquel', 'aquella', 'muy', 'más', 'menos',
    'todo', 'toda', 'todos', 'todas', 'algo', 'nada', 'alguien', 'nadie', 'donde',
    'cuando', 'como', 'porque', 'pero', 'sin', 'sobre', 'hasta', 'desde', 'hacia'
  ]
  
  const palabras = texto
    .split(/[^\wáéíóúñü]+/)
    .filter(palabra => palabra.length > 3)
    .filter(palabra => !palabrasComunes.includes(palabra))
    .filter(palabra => /^[a-záéíóúñü]+$/.test(palabra))
  
  // Contar frecuencia
  const frecuencia = {}
  palabras.forEach(palabra => {
    frecuencia[palabra] = (frecuencia[palabra] || 0) + 1
  })
  
  return Object.keys(frecuencia)
    .sort((a, b) => frecuencia[b] - frecuencia[a])
    .slice(0, 8)
}

function procesarTextoPDF(textoCompleto) {
  console.log(`📄 Procesando texto de ${textoCompleto.length} caracteres...`)
  
  const dolencias = []
  const lineas = textoCompleto.split('\n')
  
  // Múltiples estrategias para extraer dolencias
  
  // Estrategia 1: Buscar patrones de dolencia seguida de descripción
  for (let i = 0; i < lineas.length - 1; i++) {
    const linea = lineas[i].trim()
    const siguienteLinea = lineas[i + 1]?.trim() || ''
    
    // Detectar posibles nombres de dolencias (en mayúsculas o con formato específico)
    if (linea.length > 2 && linea.length < 100) {
      // Si la línea parece ser un título de dolencia
      if (linea.match(/^[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü\s\-]+$/) && 
          !linea.includes('página') && 
          !linea.includes('capítulo') &&
          siguienteLinea.length > 10) {
        
        // Buscar la descripción en las siguientes líneas
        let descripcion = ''
        let j = i + 1
        
        while (j < lineas.length && j < i + 10) {
          const lineaDesc = lineas[j].trim()
          if (lineaDesc.length > 5 && !lineaDesc.match(/^[A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ\s]+$/)) {
            descripcion += lineaDesc + ' '
            j++
          } else if (descripcion.length > 20) {
            break
          } else {
            j++
          }
        }
        
        if (descripcion.trim().length > 20) {
          dolencias.push({
            nombre: limpiarTexto(linea),
            descripcion: limpiarTexto(descripcion),
            categoria: determinarCategoria(linea),
            palabras_clave: extraerPalabrasClave(linea, descripcion)
          })
        }
      }
    }
  }
  
  // Estrategia 2: Buscar patrones con dos puntos
  const patronDosPuntos = /([A-ZÁÉÍÓÚÑÜ][a-záéíóúñü\s\-]+):\s*([^A-ZÁÉÍÓÚÑÜ]*?)(?=[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü\s]+:|$)/g
  let match
  while ((match = patronDosPuntos.exec(textoCompleto)) !== null) {
    const nombre = limpiarTexto(match[1])
    const descripcion = limpiarTexto(match[2])
    
    if (nombre.length > 2 && descripcion.length > 20) {
      dolencias.push({
        nombre,
        descripcion,
        categoria: determinarCategoria(nombre),
        palabras_clave: extraerPalabrasClave(nombre, descripcion)
      })
    }
  }
  
  // Eliminar duplicados
  const dolenciasUnicas = []
  const nombresVistos = new Set()
  
  dolencias.forEach(dolencia => {
    const nombreNormalizado = dolencia.nombre.toLowerCase().trim()
    if (!nombresVistos.has(nombreNormalizado) && dolencia.descripcion.length > 10) {
      nombresVistos.add(nombreNormalizado)
      dolenciasUnicas.push(dolencia)
    }
  })
  
  console.log(`✅ Extraídas ${dolenciasUnicas.length} dolencias únicas`)
  return dolenciasUnicas
}

function generarScriptSQL(dolencias) {
  let sql = `-- Dolencias extraídas del diccionario de Eric Corbera
-- Total: ${dolencias.length} dolencias
-- Ejecutar este script en Supabase SQL Editor

-- Limpiar tabla primero (opcional)
-- DELETE FROM dolencias;

INSERT INTO dolencias (nombre, descripcion, categoria, palabras_clave) VALUES\n`

  const valores = dolencias.map((dolencia, index) => {
    const nombre = dolencia.nombre.replace(/'/g, "''")
    const descripcion = dolencia.descripcion.replace(/'/g, "''")
    const categoria = dolencia.categoria.replace(/'/g, "''")
    const palabrasClave = dolencia.palabras_clave.map(p => p.replace(/'/g, "''")).join('","')
    
    const coma = index === dolencias.length - 1 ? ';' : ','
    return `  ('${nombre}', '${descripcion}', '${categoria}', ARRAY['${palabrasClave}'])${coma}`
  }).join('\n')

  sql += valores + '\n\n-- Verificar inserción\nSELECT COUNT(*) as total_dolencias FROM dolencias;\n'
  
  return sql
}

async function main() {
  try {
    console.log('🔍 Buscando PDF del diccionario de Eric Corbera...')
    
    const rutaPDF = await encontrarPDF()
    
    if (!rutaPDF) {
      console.error('❌ No se encontró ningún archivo PDF.')
      console.log('📝 Coloca el PDF del diccionario en el directorio raíz del proyecto.')
      console.log('📝 Nombres sugeridos: diccionario.pdf, eric-corbera.pdf, biodescodificacion.pdf')
      process.exit(1)
    }
    
    console.log(`📖 Procesando: ${rutaPDF}`)
    
    const dataBuffer = fs.readFileSync(rutaPDF)
    const data = await pdfParse(dataBuffer)
    
    console.log(`📄 PDF procesado:`)
    console.log(`   - Páginas: ${data.numpages}`)
    console.log(`   - Caracteres extraídos: ${data.text.length}`)
    
    if (data.text.length < 1000) {
      console.warn('⚠️  Texto extraído muy corto. El PDF podría estar protegido o ser una imagen.')
    }
    
    const dolencias = procesarTextoPDF(data.text)
    
    if (dolencias.length === 0) {
      console.error('❌ No se pudieron extraer dolencias del PDF.')
      console.log('💡 El PDF podría tener un formato no compatible o estar protegido.')
      process.exit(1)
    }
    
    // Guardar JSON
    const jsonPath = 'src/data/dolenciasCorberaExtraidas.json'
    fs.writeFileSync(jsonPath, JSON.stringify(dolencias, null, 2), 'utf8')
    console.log(`✅ JSON guardado: ${jsonPath}`)
    
    // Generar script SQL
    const sqlScript = generarScriptSQL(dolencias)
    const sqlPath = 'dolencias-corbera-insert.sql'
    fs.writeFileSync(sqlPath, sqlScript, 'utf8')
    console.log(`✅ Script SQL generado: ${sqlPath}`)
    
    // Mostrar estadísticas
    console.log(`\n📊 ESTADÍSTICAS:`)
    console.log(`   - Total dolencias: ${dolencias.length}`)
    
    const categorias = {}
    dolencias.forEach(d => {
      categorias[d.categoria] = (categorias[d.categoria] || 0) + 1
    })
    
    console.log(`   - Categorías:`)
    Object.entries(categorias)
      .sort(([,a], [,b]) => b - a)
      .forEach(([cat, count]) => {
        console.log(`     * ${cat}: ${count}`)
      })
    
    console.log(`\n🎉 ¡Procesamiento completado exitosamente!`)
    console.log(`\n📋 PRÓXIMOS PASOS:`)
    console.log(`   1. Revisa el archivo JSON: ${jsonPath}`)
    console.log(`   2. Ejecuta el script SQL en Supabase: ${sqlPath}`)
    console.log(`   3. Actualiza la aplicación para usar los nuevos datos`)
    
  } catch (error) {
    console.error('❌ Error procesando PDF:', error.message)
    process.exit(1)
  }
}

main()
