---
name: rn-navigation
description: Úsala cuando la task toca navegadores, tipos de rutas, parámetros o deep links en react-native-bare (React Navigation).
---
# Navegación (React Navigation)

## Estructura
- Los navegadores viven en `src/navigation/`. Un archivo por navegador (raíz, tabs, stacks por área).
- Cada navegador tiene su lista de parámetros tipada:
```ts
export type OrdersStackParamList = {
  OrderList: undefined;
  OrderDetail: { id: string };
};
```
- Las pantallas reciben sus props tipadas desde esa lista; no uses `any` en `route.params`.

## Navegar y leer parámetros
```tsx
navigation.navigate('OrderDetail', { id });

const { id } = route.params;
```
- Pasa identificadores, no objetos completos; la pantalla destino carga sus datos.
- Los parámetros deben poder serializarse: sin funciones ni instancias.

## Rutas protegidas
- La decisión de acceso vive en el navegador raíz: según el estado de sesión se monta un grupo de pantallas u otro. No la repitas en cada pantalla.

## Deep links
- La configuración `linking` (prefijos y mapa de pantallas) vive en `src/navigation/`.
- El esquema de URL y los dominios asociados se declaran además en `ios/` y `android/`: ver `rn-native`.
- Todo deep link nuevo necesita una prueba que confirme a qué pantalla llega y con qué parámetros.

## Reglas
- Nombres de rutas como constantes tipadas, no texto suelto.
- Sin lógica de negocio en navegadores más allá de la decisión de acceso.
- Cambiar la estructura de navegadores es una task `[L]`: pasa por `architect`.
