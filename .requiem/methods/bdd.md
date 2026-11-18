# Behavior-Driven Development (bdd)

## Principio
El comportamiento se describe con escenarios en lenguaje del dominio que negocio, QA y desarrollo pueden leer, y esos escenarios son las pruebas de aceptación.

## En /spec
- Cada AC se escribe como escenario `Dado / Cuando / Entonces` con vocabulario del dominio, sin términos técnicos.
- Agrega una sección "Glosario" si aparecen términos del negocio que no son obvios.

## En /plan
- Indica dónde viven los escenarios ejecutables y con qué herramienta del stack se corren.

## En /build
- `tester` escribe una prueba de aceptación por escenario, conservando el texto del escenario en el nombre o descripción de la prueba.
- Las pruebas unitarias son complemento, no reemplazo de los escenarios.

## En review
- Bloquea: escenario sin prueba, o prueba cuyo texto ya no coincide con el escenario de la spec.
