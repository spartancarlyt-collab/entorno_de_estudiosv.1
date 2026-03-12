# Base de Datos - Study Station

## Estructura

```
DBs/
├── database.json    # Base de datos principal (JSON)
└── README.md       # Este archivo
```

## Esquema

### Notes (Notas)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | number | ID único |
| title | string | Título de la nota |
| content | string | Contenido |
| updatedAt | string | Fecha de actualización |

### Tasks (Tareas)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | number | ID único |
| text | string | Texto de la tarea |
| completed | boolean | Completada o no |
| createdAt | string | Fecha de creación |

### Events (Eventos)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | number | ID único |
| title | string | Título del evento |
| time | string | Hora (HH:MM) |
| date | string | Fecha (YYYY-MM-DD) |

### Pomodoro
| Campo | Tipo | Descripción |
|-------|------|-------------|
| work | number | Sesiones de trabajo completadas |
| break | number | Descansos completados |

## Uso

### Desarrollo Web (localStorage)
Los datos se guardan en el navegador del usuario.

### Escritorio (Electron)
Los datos se pueden sincronizar con esta base de datos local.
