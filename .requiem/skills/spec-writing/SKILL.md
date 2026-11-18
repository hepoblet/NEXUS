---
name: spec-writing
description: Úsala al escribir o revisar un spec.md. Define qué hace verificable a una spec y cómo redactar criterios de aceptación.
---
# Escribir una spec

Una spec dice QUÉ y POR QUÉ. El CÓMO va en plan.md.

## Criterios de aceptación
- Formato: `ACn: Dado <contexto>, cuando <acción>, entonces <resultado observable>`.
- Cada AC debe poder verificarse con una prueba automatizada. Si no se puede, está mal escrito o es un requisito no funcional.
- Un AC, un comportamiento. Si lleva "y además", divídelo.
- Incluye los casos de error y de borde que importan al usuario, no solo el camino feliz.

## Alcance
- Lista explícita de lo que NO incluye. Lo que no está escrito se asume fuera.
- Sin nombres de librerías, archivos ni decisiones técnicas.

## Antes de entregar
- [ ] Cada AC es verificable y tiene ID
- [ ] El problema se entiende sin contexto extra
- [ ] Las preguntas abiertas están listadas, no resueltas a ojo
- [ ] Están las secciones que exigen los métodos activos (ver `.requiem/methods/`)
- [ ] Estado: `borrador`. Solo un humano la pasa a `aprobada`.
