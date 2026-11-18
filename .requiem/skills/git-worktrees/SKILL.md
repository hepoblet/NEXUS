---
name: git-worktrees
description: Úsala cuando haya que trabajar una feature sin tocar el checkout actual, o varias features en paralelo. Define dónde se crean los worktrees, cómo se preparan y cómo se cierran.
---
# Worktrees en Requiem

Un worktree es otra carpeta de trabajo del mismo repo, en su propia rama. Sirve para que dos features avancen a la vez sin pisarse, cada una con su sesión.

## Cuándo
- Hay otra feature en curso en el checkout principal.
- El humano pide trabajo en paralelo o aislado.
- No hace falta para una sola feature a la vez: trabaja en la rama y listo.

## Convención (no preguntes, ya está decidida)
- Carpeta: `.worktrees/<feature>` en la raíz del repo. Está en `.gitignore`.
- Rama: `feat/<feature>` (o `fix/<tema>`), creada desde `BRANCH_DEV` actualizada.
- Un worktree por feature, una sesión por worktree.

## Antes de crear
1. Comprueba si ya estás en un worktree: si `git rev-parse --git-dir` y `git rev-parse --git-common-dir` apuntan a carpetas distintas, ya lo estás. No crees otro.
2. Si tu CLI tiene una herramienta propia para worktrees, úsala con la convención de arriba en vez de `git worktree add`.
3. Si el plugin Superpowers está instalado, su skill `using-git-worktrees` hace este mismo proceso: síguela, con esta convención como preferencia declarada.

## Crear
```sh
node .requiem/scripts/worktree.mjs add <feature>
```
Crea `.worktrees/<feature>` en `feat/<feature>` desde `BRANCH_DEV`. Después:
1. Instala dependencias dentro del worktree solo si el proyecto ya las tiene declaradas.
2. Corre los checks del stack para confirmar que parte en verde. Si fallan, repórtalo antes de tocar nada.

## Trabajar
- Abre la sesión dentro del worktree y corre ahí `/build <feature>`.
- No edites archivos de otro worktree ni del checkout principal.
- El costo se registra en el ledger común del repo; el marcador de feature es propio de cada worktree.

## Cerrar
1. Todo commiteado y la rama subida (`/pr <feature>` cuando el humano lo pida).
2. El worktree se elimina solo después de que el PR esté mergeado o el humano lo indique:
   ```sh
   node .requiem/scripts/worktree.mjs remove <feature>
   ```
3. Nunca borres la carpeta a mano ni uses `--force`: si git se niega, hay trabajo sin guardar; repórtalo.

## Reglas
- No hagas merge entre worktrees. Cada feature llega a `BRANCH_DEV` por su PR.
- Dos worktrees no pueden tener la misma rama.
- Si la creación falla por permisos, trabaja en el checkout actual y avísalo.
