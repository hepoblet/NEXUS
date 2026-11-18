---
name: rn-performance
description: Úsala cuando la task toca listas largas, pantallas que se sienten lentas, imágenes o tiempo de arranque en React Native.
---
# Rendimiento

## Primero medir
No optimices por intuición. Reproduce el problema, identifica qué se renderiza de más o qué bloquea, y recién entonces cambia código. Si no hay un problema medido, no agregues `memo` ni `useCallback`.

## Listas
- Listas largas con `FlatList` o `SectionList`, nunca `map` dentro de un `ScrollView`.
- `keyExtractor` con un id estable; nunca el índice.
- `renderItem` y sus handlers definidos fuera del render o memorizados; el ítem como componente con `memo` si la lista es larga.
- Si las filas tienen alto fijo, entrega `getItemLayout`.
- Paginación con `onEndReached`, no cargando todo de una vez.

## Re-renders
- Lee stores con selectores acotados; suscribirse al store completo re-renderiza todo.
- No crees objetos ni arreglos nuevos en props en cada render si el hijo está memorizado.
- Estado lo más abajo posible en el árbol.

## Imágenes
- Pide el tamaño que se va a mostrar, no el original.
- Dimensiones explícitas para evitar saltos de layout.

## Arranque
- Nada de trabajo pesado al importar módulos.
- Carga diferida de pantallas y datos que no se ven al inicio.

## Reglas
- Animaciones en el hilo nativo cuando la librería lo permita.
- Una librería nueva para rendimiento solo si el plan la incluye.
- Toda optimización se reporta con el antes y el después medidos.
