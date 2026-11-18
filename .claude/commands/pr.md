---
description: Abre el PR de una feature hacia la rama de desarrollo. Uso: /pr <feature>
---
Feature: $ARGUMENTS

Solo se ejecuta cuando el humano lo pide.

1. Lee `BRANCH_DEV` de `requiem.config`. Confirma que estás en `feat/<feature>` (o `fix/<tema>`) y que no hay cambios sin commitear.
2. Verifica que todas las tasks de `specs/<feature>/tasks.md` estén marcadas `[x]` y que los checks del stack pasan. Si no, detente y di qué falta.
3. Sube la rama: `git push -u origin <rama>`.
4. Abre el PR hacia `BRANCH_DEV` con `gh pr create --base <BRANCH_DEV>`. Título y descripción en inglés, siguiendo `.github/pull_request_template.md`:
   - Título: Conventional Commit, ej. `feat(login): email and password sign-in`.
   - Qué resuelve y link a `specs/<feature>/spec.md`.
   - Tasks cubiertas y criterios de aceptación.
   - Cómo probar.
   - Cambios que las pruebas no cubren (config nativa, migraciones, variables de entorno).
   - Costo de la feature, tomado de `specs/<feature>/cost.md` si existe.
5. Entrega el link del PR. No hagas merge.
