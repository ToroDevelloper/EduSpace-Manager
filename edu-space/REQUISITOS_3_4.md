# Requisitos Funcionales 3 y 4 - EduSpace Manager

## Descripción
Implementación de los módulos de **Catálogo de Espacios** y **Gestión de Reservas** para el sistema de reservas de espacios EduSpace Manager.

---

## Estructura de Archivos Creados

```
src/
├── spaces/                    # Módulo de Espacios (RF3)
│   ├── entities/
│   │   └── space.entity.ts
│   ├── dto/
│   │   ├── create-space.dto.ts
│   │   └── update-space.dto.ts
│   ├── spaces.service.ts
│   ├── spaces.controller.ts
│   └── spaces.module.ts
│
├── resources/                 # Módulo de Recursos Adicionales (RF4)
│   ├── entities/
│   │   └── resource.entity.ts
│   ├── dto/
│   │   ├── create-resource.dto.ts
│   │   └── update-resource.dto.ts
│   ├── resources.service.ts
│   ├── resources.controller.ts
│   └── resources.module.ts
│
├── reservations/              # Módulo de Reservas (RF4)
│   ├── entities/
│   │   └── reservation.entity.ts
│   ├── dto/
│   │   ├── create-reservation.dto.ts
│   │   └── update-reservation.dto.ts
│   ├── reservations.service.ts
│   ├── reservations.controller.ts
│   └── reservations.module.ts
│
├── faculties/                 # Entidad placeholder para integración
│   └── entities/
│       └── faculty.entity.ts
│
└── teachers/                  # Entidad placeholder para integración
    └── entities/
        └── teacher.entity.ts
```

---

## Modelo de Datos

### Space (Espacio)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| name | VARCHAR(100) | Nombre del espacio |
| description | TEXT | Descripción opcional |
| type | ENUM | Tipo: salon, laboratorio, auditorio |
| maxCapacity | INT | Capacidad máxima de personas |
| location | VARCHAR(50) | Ubicación física |
| isActive | BOOLEAN | Estado del espacio |
| facultyId | INT (FK) | Relación con Facultad |

### Resource (Recurso)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| name | VARCHAR(100) | Nombre del recurso |
| description | TEXT | Descripción opcional |
| category | ENUM | Categoría: audiovisual, informatico, mobiliario, otro |
| quantityAvailable | INT | Cantidad disponible |
| isActive | BOOLEAN | Estado del recurso |

### Reservation (Reserva)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| reservationDate | DATE | Fecha de la reserva |
| startTime | TIME | Hora de inicio |
| endTime | TIME | Hora de fin |
| attendeesCount | INT | Número de asistentes |
| purpose | TEXT | Propósito de la reserva |
| status | ENUM | Estado: pendiente, confirmada, cancelada, completada |
| notes | TEXT | Notas adicionales |
| teacherId | INT (FK) | Relación con Docente |
| spaceId | INT (FK) | Relación con Espacio |

### reservation_resources (Tabla pivote)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| reservation_id | INT (FK) | ID de la reserva |
| resource_id | INT (FK) | ID del recurso |

---

## Endpoints API

### Espacios (`/spaces`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /spaces | Crear nuevo espacio |
| GET | /spaces | Obtener todos los espacios activos |
| GET | /spaces/:id | Obtener espacio por ID |
| GET | /spaces/faculty/:facultyId | Obtener espacios por facultad |
| GET | /spaces/type/:type | Obtener espacios por tipo |
| GET | /spaces/available?minCapacity=X | Obtener espacios con capacidad mínima |
| PATCH | /spaces/:id | Actualizar espacio |
| PATCH | /spaces/:id/deactivate | Desactivar espacio |
| DELETE | /spaces/:id | Eliminar espacio |

### Recursos (`/resources`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /resources | Crear nuevo recurso |
| GET | /resources | Obtener todos los recursos activos |
| GET | /resources/:id | Obtener recurso por ID |
| GET | /resources/category/:category | Obtener recursos por categoría |
| PATCH | /resources/:id | Actualizar recurso |
| PATCH | /resources/:id/deactivate | Desactivar recurso |
| DELETE | /resources/:id | Eliminar recurso |

### Reservas (`/reservations`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /reservations | Crear nueva reserva |
| GET | /reservations | Obtener todas las reservas |
| GET | /reservations/:id | Obtener reserva por ID |
| GET | /reservations/:id/detail | **Obtener detalle completo (RF6)** |
| GET | /reservations/teacher/:teacherId | Obtener reservas por docente |
| GET | /reservations/space/:spaceId | Obtener reservas por espacio |
| GET | /reservations/date/:date | Obtener reservas por fecha |
| GET | /reservations/status/:status | Obtener reservas por estado |
| PATCH | /reservations/:id | Actualizar reserva |
| PATCH | /reservations/:id/confirm | Confirmar reserva |
| PATCH | /reservations/:id/cancel | Cancelar reserva |
| DELETE | /reservations/:id | Eliminar reserva |

---

## Ejemplos de Uso

### Crear un Espacio
```json
POST /spaces
{
  "name": "Laboratorio de Computación A",
  "description": "Laboratorio con 30 computadoras",
  "type": "laboratorio",
  "maxCapacity": 30,
  "location": "Edificio B, Piso 2",
  "facultyId": 1
}
```

### Crear un Recurso
```json
POST /resources
{
  "name": "Proyector Epson",
  "description": "Proyector HD para presentaciones",
  "category": "audiovisual",
  "quantityAvailable": 5
}
```

### Crear una Reserva con Recursos
```json
POST /reservations
{
  "reservationDate": "2026-03-15",
  "startTime": "09:00",
  "endTime": "11:00",
  "attendeesCount": 25,
  "purpose": "Clase de Programación Web",
  "teacherId": 1,
  "spaceId": 1,
  "resourceIds": [1, 2, 3]
}
```

### Respuesta de Detalle Completo (RF6)
```json
GET /reservations/1/detail
{
  "id": 1,
  "fecha": "2026-03-15",
  "horaInicio": "09:00",
  "horaFin": "11:00",
  "cantidadAsistentes": 25,
  "proposito": "Clase de Programación Web",
  "estado": "confirmada",
  "docente": {
    "id": 1,
    "nombre": "Dr. Juan Pérez",
    "email": "jperez@universidad.edu",
    "facultad": "Facultad de Ingeniería"
  },
  "espacio": {
    "id": 1,
    "nombre": "Laboratorio de Computación A",
    "tipo": "laboratorio",
    "capacidadMaxima": 30,
    "ubicacion": "Edificio B, Piso 2",
    "facultad": "Facultad de Ingeniería"
  },
  "recursosAdicionales": [
    {
      "id": 1,
      "nombre": "Proyector Epson",
      "categoria": "audiovisual"
    },
    {
      "id": 2,
      "nombre": "Sistema de Sonido",
      "categoria": "audiovisual"
    }
  ]
}
```

---

## Validaciones Implementadas

### Validación de Capacidad Máxima (Requisito 5)
El sistema valida automáticamente que `attendeesCount` no supere `maxCapacity` del espacio:

```typescript
if (attendeesCount > space.maxCapacity) {
  throw new BadRequestException(
    `La cantidad de asistentes (${attendeesCount}) supera la capacidad máxima del espacio "${space.name}" (${space.maxCapacity} personas)`
  );
}
```

### Validación de Conflictos de Horario
El sistema previene reservas superpuestas en el mismo espacio:
- Misma fecha
- Horarios que se solapan

### Validaciones de DTOs
- Campos requeridos
- Formato de fechas (YYYY-MM-DD)
- Formato de horas (HH:MM)
- Números positivos para capacidades e IDs
- Longitudes máximas de strings

---

## Configuración Necesaria

### Variables de Entorno (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=eduspace_db
PORT=3000
```

### Dependencias Instaladas
- @nestjs/typeorm
- typeorm
- mysql2
- @nestjs/config
- class-validator
- class-transformer
- @nestjs/mapped-types

---

## Integración con Otros Módulos

Las entidades **Faculty** y **Teacher** han sido creadas como placeholders con la estructura mínima necesaria para las relaciones. Los equipos encargados de los requisitos 1 y 2 deben:

1. Completar los módulos `faculties` y `teachers` con sus servicios y controladores
2. Mantener las relaciones definidas en las entidades
3. No modificar los nombres de las columnas de relación

---

## Notas para el Equipo

- El sistema usa `synchronize: true` en desarrollo (desactivar en producción)
- Las relaciones ManyToMany usan tabla pivote `reservation_resources`
- Todos los endpoints usan DTOs para validación de entrada
- Los servicios están exportados para uso en otros módulos
