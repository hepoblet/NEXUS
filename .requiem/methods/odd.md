# Observability-Driven Development (odd)

## Principio
Una feature no está terminada hasta que se puede ver funcionando en producción. La instrumentación se diseña junto con la feature, no después.

## En /spec
- Sección "Observabilidad": qué preguntas hay que poder responder en producción (¿se usa?, ¿falla?, ¿cuánto demora?) y qué señal responde cada una (evento, métrica, log, traza).
- Los eventos de analítica que pida negocio van aquí, con nombre y propiedades.

## En /plan
- Dónde se emite cada señal y con qué herramienta del stack.
- Nombres de eventos y métricas siguiendo la convención del proyecto.

## En /build
- Cada task que agrega comportamiento agrega también su señal.
- `tester` verifica que la señal se emite con los datos esperados, igual que cualquier otro AC.

## En review
- Bloquea: comportamiento nuevo sin la señal definida en la spec, errores que se tragan sin registrar, datos personales o secretos en logs o eventos.
