---
name: herdr-core
description: Usa herdr-core (CLI `hc`) para procesos de larga duración (servidores, builds, watchers) y para lanzar o coordinar agentes de otro CLI. No lo uses para el pipeline normal, que va con subagentes.
---
# herdr-core en Requiem

`hc` es herdr-core. No es `herdr` (el multiplexor antiguo, otro comando).

## Cuándo
- `$HC_TERMINAL_ID` definido → estás dentro de herdr-core: puedes usar `hc`.
- No definido → no asumas que está instalado. Verifica con `hc --version`; si falla, sigue sin él y no lo instales.

## Antes de usarlo
Corre `hc --skill` y sigue esa guía: es la referencia oficial para delegar, esperar, reportar y limpiar.

## Reglas
- Procesos largos en background y con nombre: `hc run --bg --name <nombre> <comando>`.
- Antes de lanzar un servidor, revisa con `hc ls` que no exista ya.
- Para otra IA usa un template de `.requiem/herdr/templates/`. No inventes comandos de arranque.
- Un agente lanzado por `hc` no hace commit ni push: reporta y el orquestador decide.
- Cierra lo que abriste al terminar la task.

Instalar los templates en esta máquina: `node .requiem/scripts/herdr-templates.mjs`.
