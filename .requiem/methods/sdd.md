# Spec-Driven Development (sdd)

## Principio
La spec es la fuente de verdad. No se construye nada que no esté en una spec aprobada; si cambia el requisito, primero cambia la spec.

## En /spec
- `spec.md` con problema, alcance (incluye / no incluye), criterios de aceptación numerados y preguntas abiertas.
- Sin decisiones técnicas: eso es del plan.
- Queda en `borrador` hasta que un humano la aprueba.

## En /plan
- `plan.md` responde el CÓMO; `tasks.md` lo divide en tasks atómicas.
- Cada AC está cubierto por al menos una task.

## En /build
- Si durante la implementación aparece algo que la spec no cubre, detente y pide actualizar la spec. No improvises alcance.

## En review
- Bloquea: código que implementa algo fuera de la spec, o un AC de la task sin cubrir.
