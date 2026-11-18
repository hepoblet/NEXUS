---
description: Genera plan.md y tasks.md para una spec aprobada. Uso: /plan <feature>
---
Feature: $ARGUMENTS

0. Corre `node .requiem/scripts/cost/mark.mjs plan $ARGUMENTS` para atribuir el costo de este trabajo.
1. Verifica que exista `specs/$ARGUMENTS/spec.md` y que esté marcada como aprobada. Si no, detente.
2. Revisa `docs/CODEMAP.md` si existe. Usa el subagente `explorer` solo para lo que el mapa no responda.
3. Usa el subagente `architect` con la spec y lo que encontró explorer. Debe producir `plan.md` y `tasks.md`.
4. Crea `specs/$ARGUMENTS/notes.md` desde `specs/_template/notes.md` con lo que explorer ubicó en "Dónde está cada cosa".
5. Resume: número de tasks por tamaño [S]/[M]/[L], dependencias nuevas y riesgos.
6. Termina con: "Plan listo. Corre /build $ARGUMENTS para implementar".
