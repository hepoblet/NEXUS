---
name: acceptance-tests
description: Úsala para convertir criterios de aceptación en pruebas automatizadas, en cualquier stack. Complementa a la skill de pruebas del stack activo.
---
# De criterio de aceptación a prueba

## Mapeo
Cada `ACn: Dado X, cuando Y, entonces Z` produce al menos una prueba con tres bloques:
1. **Dado**: prepara el contexto.
2. **Cuando**: ejecuta una sola acción.
3. **Entonces**: verifica el resultado observable.

El nombre de la prueba empieza con el ID del AC (`AC2: ...`). El reviewer usa ese ID para comprobar cobertura.

## Reglas
- Prueba comportamiento observable (lo que ve el usuario o el consumidor de la API), no detalles internos.
- Simula solo los bordes del sistema (red, reloj, disco, servicios externos), no el código propio.
- Sin esperas fijas ni dependencia del orden de ejecución.
- Una prueba que pasa sin implementación no prueba nada: corrígela.
- Herramientas, ubicación y helpers: los define la skill de pruebas de `.requiem/stack/skills/` o STACK.md.

## Salida esperada
```
AC1 → <archivo>::<nombre de la prueba> — rojo|verde
AC2 → ...
AC sin cubrir: <lista o "ninguno">
```
