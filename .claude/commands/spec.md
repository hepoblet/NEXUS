---
description: Crea specs/<feature>/spec.md desde una idea o issue. Uso: /spec <feature> <descripción o link a issue>
---
Feature: $ARGUMENTS

0. Corre `node .requiem/scripts/cost/mark.mjs spec <feature>` para atribuir el costo de este trabajo.
1. Lee `.requiem/skills/spec-writing/SKILL.md` y los métodos activos de `requiem.config`.
2. Si el argumento trae un issue (GitHub, Jira), léelo con el MCP correspondiente.
3. Crea `specs/<feature>/spec.md` desde `specs/_template/spec.md`. Incluye las secciones que cada método activo exija.
4. Criterios de aceptación numerados AC1..ACn, verificables por una prueba. Marca qué queda fuera de alcance.
5. Termina con: "Spec lista en specs/<feature>/spec.md. Revísala y luego corre /plan <feature>". No sigas al plan sin aprobación humana.
