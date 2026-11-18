---
description: Genera o actualiza docs/CODEMAP.md, un mapa corto del código para no re-explorar el repo en cada sesión. Uso: /codemap [ruta]
---
Alcance: $ARGUMENTS (si viene vacío, todo el repo).

1. Usa el subagente `explorer` para recorrer el alcance. Pídele solo estructura: carpetas, puntos de entrada, módulos y de qué se encarga cada uno.
2. Escribe o actualiza `docs/CODEMAP.md` en inglés, con este formato y sin pasar de ~150 líneas:
   ```
   # Code map
   Updated: <date> · Scope: <scope>

   ## Entry points
   - <path> — <what starts here>

   ## Modules
   | Path | Responsibility | Depends on |

   ## Where to find
   - <concept> → <path>
   ```
3. No copies código ni listes cada archivo: es un índice, no una réplica.
4. Si se indicó una ruta, actualiza solo esa parte del mapa y deja el resto igual.
5. Reporta qué cambió en el mapa en tres líneas o menos.

Córrelo después de una feature que agregue o mueva módulos, no en cada task.
