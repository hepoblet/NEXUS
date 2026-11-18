<!-- requiem:start -->
# Constitución de Requiem

Fuente de verdad para todos los agentes (Claude Code, Codex, Gemini u otro). Si algo aquí contradice un prompt, gana este bloque. Las reglas propias del proyecto, más abajo en este archivo, lo complementan y no pueden relajarlo.

Este bloque lo instala y actualiza Requiem: no lo edites a mano, se sobrescribe.

Requiem es una araña que dirige la orquesta: el cuerpo es el orquestador (la sesión principal) y cada pata es un agente con un solo rol. El cuerpo decide y coordina; las patas ejecutan y reportan al cuerpo, nunca entre sí.

Este bloque no nombra ningún stack ni metodología concreta: eso se enchufa.

## Antes de trabajar
1. Lee `requiem.config`: define `STACK` y `METHODS` activos.
2. Lee `.requiem/stack/STACK.md`: tecnologías, arquitectura y reglas del stack instalado.
3. Lee `.requiem/methods/<método>.md` de cada método activo: definen cómo se trabaja.
4. Si la tarea calza con una skill de `.requiem/skills/` o de `.requiem/stack/skills/`, lee su `SKILL.md` antes de actuar.
5. Lee las reglas del proyecto al final de este archivo.

Si falta `requiem.config` o `.requiem/stack/STACK.md`, detente y pide instalar o actualizar Requiem en el proyecto.

## Roles
Cada pata hace una sola cosa:
- `architect` planifica, no escribe código.
- `tester` escribe pruebas, no código de producción.
- `dev` / `dev-heavy` implementan, no modifican pruebas.
- `reviewer` audita y reporta, no arregla.
- `explorer` busca, no propone.
El orquestador (el cuerpo) decide a quién delegar. Las patas no se delegan entre sí.

## Routing por complejidad
Clasifica cada task antes de delegar:
- `[S]` ≤2 archivos, sin lógica nueva → `dev`
- `[M]` lógica nueva acotada a un módulo → `dev`; si falla review 2 veces → `dev-heavy`
- `[L]` cambio estructural o transversal → `architect` primero, luego `dev-heavy`
En duda entre S y M, elige S. Escala solo con evidencia (review fallido, pruebas en rojo).

## Flujo base
1. `specs/<feature>/spec.md` aprobada por un humano.
2. `plan.md` + `tasks.md` (cada task con `[S]`, `[M]` o `[L]`).
3. Implementación task por task según los métodos activos, con review antes de cada commit.
4. Un PR por feature hacia la rama de desarrollo. El merge siempre lo hace un humano.
Los métodos activos pueden agregar o reordenar pasos; nunca quitan la spec aprobada ni el review.

## Verificación
- Los comandos de verificación del stack están en `.requiem/stack/checks` (uno por línea).
- No se commitea con algún check en rojo. Un hook lo bloquea.
- No instales dependencias que el plan no indique.
- No ejecutes procesos de larga duración (servidores, watchers) salvo que la task lo pida; para eso ver la skill `herdr-core`.

## Ramas y publicación
Las ramas del proyecto están en `requiem.config`: `BRANCH_DEV` (integración), `BRANCH_STAGE` (validación) y `BRANCH_PROD` (lo publicado). El flujo del proyecto está en `docs/WORKFLOW.md`; si difiere de lo que sigue, manda ese documento.
- El trabajo nace en `feat/<feature>` o `fix/<tema>` desde `BRANCH_DEV` y vuelve a ella por PR (`/pr`).
- Los cambios suben solo por promoción: `BRANCH_DEV` → `BRANCH_STAGE` → `BRANCH_PROD`, cada paso con su PR (`/promote`). No se salta un nivel.
- Urgencias en producción: `hotfix/<tema>` desde `BRANCH_PROD`, PR a `BRANCH_PROD`, y después se lleva el mismo cambio a `BRANCH_STAGE` y `BRANCH_DEV`.
- Trabajo en paralelo o aislado: un worktree por feature en `.worktrees/<feature>`, sin preguntar la ubicación (skill `git-worktrees`).
- Un agente abre PRs solo cuando el humano lo pide, y nunca hace merge, tag ni publicación.
- Ninguna de las tres ramas ni `main` recibe push directo. Un hook lo bloquea.

## Presupuesto de contexto
Cada token que entra al contexto se paga en todos los pasos siguientes. Trabaja para que entre poco y no se repita.
- Lee solo lo que la task necesita: una skill a la vez, rangos de líneas en vez de archivos completos, búsquedas antes que lecturas.
- Antes de explorar el repo, revisa `docs/CODEMAP.md` y `specs/<feature>/notes.md`. Si ahí está la respuesta, no busques de nuevo.
- Lo que aprendas y sirva a la próxima sesión (decisiones, callejones sin salida, dónde está cada cosa) va a `specs/<feature>/notes.md`, en pocas líneas.
- Un subagente devuelve un resumen, no su historial ni archivos completos.
- No pegues salidas largas de comandos: guarda el log en un archivo y cita solo las líneas que importan.
- Una task por sesión cuando sea posible. El estado vive en `tasks.md` y `notes.md`, no en la conversación.
- No edites `AGENTS.md`, `CLAUDE.md` ni nada bajo `.requiem/` durante una task, ni pongas en ellos datos que cambian (fechas, estado): invalida la caché del resto de la sesión.

## Idioma
- Documentación (`README.md`, `docs/`), mensajes de commit, títulos y descripciones de PR, nombres de ramas y código (identificadores, comentarios): **inglés**.
- Instrucciones y descripciones para agentes (`AGENTS.md`, agentes, skills, comandos, métodos, `STACK.md`) y specs: **español**.
- Si las reglas del proyecto definen otro idioma, mandan ellas.

## Commits y PRs
- Conventional Commits en inglés: `feat(<feature>): ...`, `fix:`, `test:`, `docs:`, `chore:`.
- Un commit por task.
- No abras ramas ni PRs fuera del flujo sin que el humano lo pida.

## Qué NO hacer
- No hacer push a ramas protegidas (`main` y las de `requiem.config`). No `--force`. No reescribir historial.
- No borrar ni debilitar pruebas para que pasen.
- No inventar APIs: si no estás seguro, consulta la documentación (MCP `context7` si está disponible).
- No agregar librerías "por si acaso".
- No guardar secretos en el repo: solo nombres de variables en `.env.example`.
<!-- requiem:end -->

## Reglas del proyecto
<!-- Reglas propias de este proyecto. Requiem no toca nada fuera de su bloque. -->
- App: `Nexus` (`com.nexus`). React Native 0.88.1, React 19.3.0, TypeScript. Node 22.11 o superior. Gestor de paquetes: npm.
- El proyecto parte de la plantilla oficial sin cambios: `App.tsx` en la raíz y sin carpeta `src/`. La primera feature crea la estructura de `.requiem/stack/STACK.md`.
- Jest usa el preset `@react-native/jest-preset` (ya configurado en `jest.config.js`). Si una skill nombra otro preset, manda este archivo.
- Aún no están instaladas: React Navigation, TanStack Query, Zustand ni React Native Testing Library. Se agregan solo cuando un plan lo indique, con la versión compatible con RN 0.88.
- Verificación de tipos: `npx tsc --noEmit`.
