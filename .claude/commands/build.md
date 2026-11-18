---
description: Ejecuta el pipeline task por task según los métodos activos. Uso: /build <feature> [T3] para una task puntual
---
Feature: $ARGUMENTS

Lee `requiem.config` y `specs/<feature>/{spec,plan,tasks}.md`. Si falta alguno, detente.
Lee también `specs/<feature>/notes.md` si existe: evita repetir exploración y errores de sesiones anteriores.
Trabaja en la rama `feat/<feature>`; si no existe, créala desde `BRANCH_DEV` actualizada. Si `BRANCH_DEV` no existe en el repo, usa la rama por defecto y avísalo.

Por cada task pendiente de `tasks.md` (o solo la indicada), en orden:

0. Corre `node .requiem/scripts/cost/mark.mjs build <feature> <T n>` antes de empezar la task, para atribuirle su costo.
1. Pruebas e implementación, según `METHODS`:
   - Con `tdd`: **tester** escribe las pruebas de los AC y confirma que fallan; luego el implementador las hace pasar.
   - Sin `tdd`: el implementador va primero; luego **tester** cubre los AC.
   Implementador según etiqueta: `[S]`/`[M]` → **dev**, `[L]` → **dev-heavy**.
2. Pasos extra que agregue cada método activo (ver la sección "En /build" de su archivo en `.requiem/methods/`).
3. **reviewer** audita. Si `BLOQUEADO`:
   - vuelve al implementador con el reporte (máximo 2 iteraciones);
   - si era `dev` y falla la segunda, escala una vez a `dev-heavy`;
   - si sigue bloqueado, detente y reporta al humano.
4. Si `APROBADO`: marca la task `[x]` en tasks.md, anota en `notes.md` lo que sirva a la próxima sesión (una línea por punto) y commitea:
   `git add -A && git commit -m "feat(<feature>): <task title in English> (T<n>)"`

Al terminar:
- Resume tasks hechas, archivos, pruebas agregadas y deuda detectada.
- Guarda el costo de la feature: `node .requiem/scripts/cost/report.mjs <feature> --md > specs/<feature>/cost.md`, y cita el total en el resumen.
- Corre `node .requiem/scripts/cost/mark.mjs clear`.
- Indica que el siguiente paso es `/pr <feature>`. No abras el PR ni hagas merge por tu cuenta: lo decide el humano.
