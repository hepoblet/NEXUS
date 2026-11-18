# Test-Driven Development (tdd)

## Principio
Rojo, verde, refactor. La prueba se escribe antes que el código y define cuándo la task está terminada.

## En /spec
- Cada AC debe poder convertirse en una prueba automatizada.

## En /plan
- Cada task indica qué AC cubre, para saber qué pruebas escribir.

## En /build
1. `tester` escribe las pruebas de los AC de la task y confirma que fallan (rojo).
2. El implementador escribe lo mínimo para que pasen (verde), sin tocar las pruebas.
3. Refactor solo con las pruebas en verde.

## En review
- Bloquea: AC sin prueba, pruebas modificadas por el implementador, pruebas que no fallaban antes de implementar.
