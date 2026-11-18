---
description: Abre el PR de promoción entre ramas del flujo. Uso: /promote stage | /promote production
---
Destino: $ARGUMENTS

Solo se ejecuta cuando el humano lo pide. Nunca hace merge, tag ni publicación.

1. Lee las ramas de `requiem.config`. La promoción es siempre al nivel siguiente:
   - `stage`: de `BRANCH_DEV` hacia `BRANCH_STAGE`.
   - `production`: de `BRANCH_STAGE` hacia `BRANCH_PROD`.
   Cualquier otro destino u origen: detente.
2. Actualiza referencias (`git fetch`) y lista los commits que el destino aún no tiene: `git log --oneline origin/<destino>..origin/<origen>`. Si no hay ninguno, dilo y termina.
3. Revisa si ya existe un PR abierto de esa promoción; si existe, entrega su link y termina.
4. Abre el PR con `gh pr create --base <destino> --head <origen>`. En inglés:
   - Título: `release: promote <origen> to <destino>`.
   - Features y fixes incluidos, agrupados por tipo, con link a sus PRs.
   - Cambios que requieren acción al desplegar (migraciones, variables de entorno, build nativo nuevo).
   - Para `production`: versión propuesta y resultado de la validación en stage, si el humano lo entregó.
5. Entrega el link del PR y recuerda qué queda en manos del humano: revisar, hacer merge con merge commit, y para producción crear el tag de versión.
