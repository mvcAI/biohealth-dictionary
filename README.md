# 🌸 Aplicación de Biodescodificación - Eric Corbera

Una aplicación web moderna y hermosa para explorar el significado emocional de las dolencias físicas basada en los principios de biodescodificación de Eric Corbera.

<!-- Cambio para forzar commit - actualizado -->

## ✨ Características Principales

### 🎨 **Diseño Holístico y Espiritual**
- **Colores suaves**: Lilas, verdes y dorados que transmiten calma
- **Tipografía elegante**: Inter + Playfair Display para legibilidad y estética
- **Iconografía espiritual**: Mandalas, flores, corazones y elementos de la naturaleza
- **Animaciones suaves**: Transiciones que evocan paz y serenidad
- **Responsive design**: Perfecto en móviles, tablets y desktop

### 🔍 **Búsqueda Inteligente**
- **Búsqueda en tiempo real** con debounce para performance óptima
- **30 dolencias completas** basadas en biodescodificación
- **Búsqueda por nombre, descripción y palabras clave**
- **Categorización por sistemas corporales**
- **Resultados organizados** con información emocional completa

### 👤 **Sistema de Usuarios Completo**
- **Autenticación segura** con Supabase Auth
- **Registro y login** con validaciones amigables
- **Área personal** para seguimiento de progreso
- **Persistencia de datos** en la nube

### 📊 **Seguimiento Personal**
- **Guardar dolencias** de interés para seguimiento
- **Crear registros de progreso** con notas personales
- **Historial cronológico** de evolución emocional
- **Edición de notas** para reflexiones personales

### 💬 **Consultas a Expertos**
- **Formulario completo** para consultas online
- **Sistema de prioridades** (Baja, Normal, Alta, Urgente)
- **Estados de seguimiento** (Pendiente, En revisión, Respondida)
- **Historial de consultas** organizado cronológicamente

## 🗄️ Base de Datos Supabase

### **Tablas Principales**
- **`dolencias`**: 30 dolencias con interpretaciones emocionales
- **`perfiles`**: Información adicional de usuarios
- **`progresos`**: Seguimiento personal de sanación
- **`consultas_online`**: Sistema de consultas a expertos
- **`dolencias_guardadas`**: Dolencias favoritas por usuario

### **Características de Seguridad**
- **Row Level Security (RLS)** habilitado
- **Políticas de acceso** granulares
- **Autenticación** integrada
- **Búsquedas optimizadas** con índices de texto completo

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + Vite
- **Styling**: CSS customizado con variables y gradientes
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Iconos**: Lucide React
- **Hosting**: Desplegable en Vercel, Netlify, etc.

## 📋 Dolencias Incluidas

### **Sistema Musculoesquelético (6)**
- Dolor de espalda, Artritis, Dolor de rodillas
- Dolor de hombros, Fibromialgia, Lumbalgia

### **Sistema Respiratorio (3)**
- Asma, Dolor de garganta, Sinusitis

### **Piel (4)**
- Eczema, Herpes labial, Alopecia, Acné

### **Sistema Digestivo (3)**
- Gastritis, Colon irritable, Hemorroides

### **Otros Sistemas (14)**
- Sistema nervioso, emocional, endocrino, urinario
- Oídos, ojos, cardiovascular, reproductivo

## 🛠️ Configuración e Instalación

### **1. Clonar e Instalar**
```bash
git clone [url-del-repo]
cd biodescodificacion-app
npm install
```

### **2. Configurar Supabase**
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar `supabase-setup.sql` en SQL Editor
3. Ejecutar `dolencias-insert.sql` para poblar datos
4. Configurar variables de entorno

### **3. Variables de Entorno**
```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### **4. Desarrollo**
```bash
npm run dev
```

### **5. Producción**
```bash
npm run build
npm run preview
```

## 📚 Documentación Detallada

El proyecto incluye guías paso a paso completas:

- **`CONFIGURACION_SUPABASE.md`** - Configurar base de datos
- **`EJECUTAR_BASE_DATOS.md`** - Scripts SQL
- **`POBLAR_DOLENCIAS.md`** - Insertar datos
- **`CONFIGURAR_ENV.md`** - Variables de entorno
- **`PROBAR_AUTENTICACION.md`** - Testing de usuarios
- **`PROBAR_BUSQUEDAS.md`** - Testing de búsquedas
- **`PROBAR_AREA_PERSONAL.md`** - Testing de progreso
- **`PROBAR_CONSULTAS.md`** - Testing de consultas

## 🎯 Casos de Uso

### **Para Usuarios Finales**
- **Explorar** el significado emocional de dolencias físicas
- **Aprender** sobre biodescodificación de manera intuitiva
- **Hacer seguimiento** de su proceso de sanación personal
- **Consultar expertos** para orientación profesional

### **Para Terapeutas**
- **Herramienta de consulta** rápida durante sesiones
- **Base de datos** organizada de interpretaciones
- **Sistema** para responder consultas de pacientes
- **Recurso educativo** para compartir con pacientes

### **Para Centros de Bienestar**
- **Plataforma** para ofrecer a pacientes/clientes
- **Sistema** de consultas online integrado
- **Base de conocimiento** accesible 24/7
- **Herramienta** de seguimiento de progreso

## 🌟 Filosofía del Proyecto

Esta aplicación está diseñada para ser más que una herramienta técnica. Es un **espacio sagrado digital** donde las personas pueden:

- **Reconectar** con la sabiduría de su cuerpo
- **Comprender** los mensajes emocionales de las dolencias
- **Iniciar** un proceso de sanación consciente
- **Acompañarse** en su viaje de autoconocimiento

## 🤝 Contribuciones

El proyecto está abierto a contribuciones que mantengan la **calidad, el propósito sanador y la estética holística** de la aplicación.

## 📄 Licencia

Este proyecto es una herramienta de bienestar y autoconocimiento. Su uso debe ser siempre **complementario** a la atención médica profesional, nunca sustituto.

---

**Creado con ❤️ para el bienestar y la sanación emocional**

*Recuerda: El cuerpo habla, solo necesitamos aprender a escucharlo.*
