# FVXMYA - Sistema de Gestión de Reuniones Organizacionales

[![Angular](https://img.shields.io/badge/Angular-19.2.0-red?logo=angular&logoColor=white)](https://angular.io/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-19.0.10-blue?logo=primeng&logoColor=white)](https://primeng.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Private-yellow.svg)](LICENSE)

## 📋 Descripción

FVXMYA es una aplicación web moderna desarrollada con Angular 19 para la gestión integral de reuniones organizacionales. El sistema permite administrar organizaciones, planificar reuniones, gestionar agendas, registrar acuerdos y generar documentos oficiales como actas de reunión.

## ✨ Características Principales

### 🏢 Gestión de Organizaciones
- Administración completa de organizaciones
- Gestión de miembros y roles
- Control de acceso por niveles (Admin, Líder, Miembro)

### 📅 Sistema de Reuniones
- Planificación y programación de reuniones
- Gestión de participantes y convocados
- Control de asistencia en tiempo real
- Seguimiento de estados (Pendiente, En Proceso, Cerrada)
- Soporte para sesiones ordinarias y extraordinarias

### 📝 Gestión de Agendas
- Creación y edición de agendas anuales
- Organización de temas por meses
- Vinculación automática con tipos de reunión

### 🤝 Control de Acuerdos
- Registro de acuerdos por reunión
- Asignación de responsables
- Seguimiento de fechas de cumplimiento
- Vista consolidada de acuerdos personales

### 📄 Generación de Documentos
- Exportación automática de actas de reunión
- Plantillas personalizables en formato DOCX
- Datos estructurados con información completa de la reunión

### 🔐 Sistema de Autenticación
- Autenticación con JWT
- Múltiples niveles de autorización
- Control de acceso granular por funcionalidades

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 19.2.0** - Framework principal
- **PrimeNG 19.0.10** - Biblioteca de componentes UI
- **PrimeFlex 4.0.0** - Sistema de layout flexbox
- **RxJS 7.8.0** - Programación reactiva

### Funcionalidades Avanzadas
- **@auth0/angular-jwt 5.2.0** - Manejo de tokens JWT
- **Docxtemplater 3.61.1** - Generación de documentos Word
- **File-saver 2.0.5** - Descarga de archivos
- **PizZip 3.1.8** - Compresión para documentos

### Desarrollo
- **TypeScript 5.7.2** - Lenguaje de programación
- **Angular CLI 19.2.6** - Herramientas de desarrollo
- **Karma & Jasmine** - Testing unitario

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm 9+ o Bun (recomendado)
- Angular CLI 19+

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd fvxmya
   ```

2. **Instalar dependencias**
   ```bash
   # Con npm
   npm install
   
   # Con Bun (recomendado)
   bun install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Editar src/app/environment/environment.development.ts
   export const baseUrl = 'http://localhost:3000/api';
   ```

4. **Ejecutar la aplicación**
   ```bash
   # Modo desarrollo
   npm start
   # o
   bun run start
   
   # La aplicación estará disponible en http://localhost:4200
   ```

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── access-denied/          # Componente de acceso denegado
│   ├── agendas/               # Módulo de gestión de agendas
│   ├── agreements/            # Módulo de acuerdos
│   ├── auth/                  # Autenticación y usuarios
│   ├── meetings/              # Gestión de reuniones
│   ├── organizations/         # Gestión de organizaciones
│   ├── services/              # Servicios globales
│   ├── shared/                # Componentes y servicios compartidos
│   ├── sidemenu/              # Menú lateral
│   ├── topics/                # Gestión de temas
│   └── types-of-meetings/     # Tipos de reunión
├── assets/
│   └── templates/             # Plantillas de documentos
└── styles.css                # Estilos globales
```

## 🔑 Roles y Permisos

### Administrador (Admin)
- Gestión completa de usuarios
- Acceso a todas las funcionalidades del sistema

### Líder de Organización
- Gestión completa de su organización
- Creación y administración de reuniones
- Gestión de agendas y acuerdos

### Miembro
- Visualización de reuniones asignadas
- Gestión de acuerdos personales
- Participación en reuniones

## 📱 Funcionalidades por Módulo

### 🏢 Organizaciones (`/organizaciones`)
- Lista de organizaciones del usuario
- Detalles y miembros de cada organización
- Gestión de tipos de reunión

### 📅 Reuniones (`/reuniones`)
- Programación de nuevas reuniones
- Vista detallada con control de asistencia
- Cambio de estados y seguimiento

### 📋 Agendas (`/agendas`)
- Creación de agendas anuales por tipo de reunión
- Gestión de temas organizados por meses
- Vinculación automática con reuniones

### 🤝 Acuerdos (`/acuerdos`)
- Vista personal de acuerdos asignados
- Acuerdos por reunión específica
- Seguimiento de cumplimiento

### 👥 Usuarios (`/usuarios`)
- Panel administrativo de usuarios (Solo Admin)
- Gestión de roles y permisos

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run start          # Servidor de desarrollo
npm run build          # Build de producción
npm run watch          # Build con watch mode
npm run test           # Ejecutar tests

# Angular CLI
npm run ng             # Comando ng directo
```

## 🌐 Configuración de Entorno

### Development
```typescript
// src/app/environment/environment.development.ts
export const baseUrl = 'http://localhost:3000/api';
```

### Production
```typescript
// src/app/environment/environment.ts
export const baseUrl = 'https://your-api-domain.com/api';
```

## 📄 Generación de Documentos

El sistema incluye funcionalidad avanzada para generar actas de reunión en formato DOCX:

- Plantilla base en `assets/templates/plantilla_acta.docx`
- Datos dinámicos incluyen: participantes, temas, acuerdos, fechas
- Descarga automática del documento generado

## 🔍 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Tests con cobertura
npm run test -- --code-coverage

# Tests en modo watch
npm run test -- --watch
```

## 📝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:

- **Email**: [contacto@fevex.com]
- **Issues**: Utiliza el sistema de issues de GitHub

## 📜 Licencia

Este proyecto es privado y propietario. Todos los derechos reservados.

---

**Desarrollado con ❤️ por el equipo FEVEX**