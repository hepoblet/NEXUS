---
description: Muestra el costo en tokens (y en dinero si hay precios configurados) del proyecto o de una feature. Uso: /cost [feature]
---
Alcance: $ARGUMENTS (vacío = todo el proyecto).

1. Corre `node .requiem/scripts/cost/report.mjs $ARGUMENTS` y muestra la salida tal cual.
2. Agrega como máximo tres observaciones útiles: qué task o agente concentra el gasto, si el porcentaje de caché es bajo (menos de 50%) y qué lo explicaría, y si alguna task [S] costó más que una [M].
3. Si el reporte dice que no hay precios, indica que se configuran en `.requiem/pricing.json`. No inventes precios.
4. No leas el ledger directamente: usa el script.
