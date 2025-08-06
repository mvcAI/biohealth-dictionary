// Procesador para convertir los datos existentes al formato de Supabase
import fs from 'fs'

function generarScriptSQL(dolencias) {
  let sql = `-- Dolencias de biodescodificación basadas en Eric Corbera
-- Total: ${dolencias.length} dolencias
-- Ejecutar este script en Supabase SQL Editor

-- Limpiar tabla primero (opcional)
DELETE FROM dolencias WHERE categoria != 'SISTEMA_PLACEHOLDER';

INSERT INTO dolencias (nombre, descripcion, categoria, palabras_clave) VALUES\n`

  const valores = dolencias.map((dolencia, index) => {
    const nombre = dolencia.nombre.replace(/'/g, "''")
    const descripcion = dolencia.descripcion.replace(/'/g, "''")
    const categoria = dolencia.categoria.replace(/'/g, "''")
    const palabrasClave = dolencia.palabras_clave.join('","')
    
    const coma = index === dolencias.length - 1 ? ';' : ','
    return `  ('${nombre}', '${descripcion}', '${categoria}', ARRAY['${palabrasClave}'])${coma}`
  }).join('\n')

  sql += valores + '\n\n-- Verificar inserción\nSELECT COUNT(*) as total_dolencias FROM dolencias;\nSELECT categoria, COUNT(*) as cantidad FROM dolencias GROUP BY categoria ORDER BY cantidad DESC;\n'
  
  return sql
}

async function main() {
  try {
    console.log('📄 Procesando datos de biodescodificación...')
    
    // Leer datos existentes
    const dolenciasData = JSON.parse(fs.readFileSync('src/data/dolenciasCorberaCompletas.json', 'utf8'))
    
    console.log(`✅ Cargadas ${dolenciasData.length} dolencias`)
    
    // Generar script SQL
    const sqlScript = generarScriptSQL(dolenciasData)
    const sqlPath = 'dolencias-insert.sql'
    fs.writeFileSync(sqlPath, sqlScript, 'utf8')
    console.log(`✅ Script SQL generado: ${sqlPath}`)
    
    // Estadísticas
    const categorias = {}
    dolenciasData.forEach(d => {
      categorias[d.categoria] = (categorias[d.categoria] || 0) + 1
    })
    
    console.log(`\n📊 ESTADÍSTICAS:`)
    console.log(`   - Total dolencias: ${dolenciasData.length}`)
    console.log(`   - Categorías:`)
    Object.entries(categorias)
      .sort(([,a], [,b]) => b - a)
      .forEach(([cat, count]) => {
        console.log(`     * ${cat}: ${count}`)
      })
    
    console.log(`\n✅ ¡Datos procesados exitosamente!`)
    console.log(`\n📋 PRÓXIMO PASO: Configurar Supabase`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

main()
