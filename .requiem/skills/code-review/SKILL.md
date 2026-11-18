---
name: code-review
description: Úsala al revisar una task antes de commit o PR, en cualquier stack. Define los checks, qué bloquea y el formato del reporte.
---
# Review

## 1. Checks automáticos
Corre cada línea de `.requiem/stack/checks`. Uno en rojo bloquea.

## 2. Cobertura de la spec
- Cada AC de la task tiene al menos una prueba cuyo nombre empieza con su ID.
- El implementador no modificó archivos de pruebas.

## 3. Reglas
- `AGENTS.md`: sección "Qué NO hacer", idioma, dependencias fuera del plan.
- `.requiem/stack/STACK.md`: arquitectura y convenciones.
- Lo que cada método activo pida revisar (sección "En review" de su archivo en `.requiem/methods/`).
- Si el stack tiene una skill de review propia, aplícala además de esta.

## 4. Calidad
- Errores manejados, no tragados.
- Sin código muerto, comentado ni de depuración.
- Nombres que dicen lo que hacen.

## Severidad
- **Bloqueante**: check en rojo, AC sin prueba, prueba modificada por el implementador, regla de AGENTS.md o STACK.md violada, dependencia no planificada.
- **Sugerencia**: legibilidad, nombres, micro-optimizaciones.

## Formato del reporte (obligatorio)
```
RESULTADO: APROBADO | BLOQUEADO
Checks: <comando> ✅/❌ ...
Bloqueantes:
- <archivo:línea> — <qué> — <regla>
Sugerencias:
- ...
AC sin cubrir: <lista o "ninguno">
```
