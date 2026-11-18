---
description: Crea, lista o elimina el worktree de una feature para trabajar en paralelo. Uso: /worktree add <feature> | remove <feature> | list
---
Acción: $ARGUMENTS

1. Lee `.requiem/skills/git-worktrees/SKILL.md` y síguela.
2. Ejecuta `node .requiem/scripts/worktree.mjs $ARGUMENTS`.
3. Según la acción:
   - `add`: corre los checks del stack dentro del worktree y reporta la ruta, la rama y si parte en verde. Indica que la sesión de esa feature debe abrirse en esa carpeta.
   - `remove`: solo si el PR de la feature está mergeado o el humano lo pidió. Si git se niega a eliminarlo, no fuerces: reporta qué quedó sin guardar.
   - `list`: muestra la salida.
