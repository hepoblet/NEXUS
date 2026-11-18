---
name: rn-testing
description: Úsala al escribir pruebas en react-native-bare (Jest con preset react-native + React Native Testing Library). Complementa a acceptance-tests con herramientas y helpers concretos.
---
# Pruebas (RN CLI)

## Ejemplo
```tsx
it('AC2: dado carrito vacío, cuando toca "Pagar", entonces ve mensaje de carrito vacío', async () => {
  renderWithProviders(<CartScreen />, { cart: [] });
  fireEvent.press(screen.getByRole('button', { name: /pagar/i }));
  expect(await screen.findByText(/carrito vacío/i)).toBeOnTheScreen();
});
```

## Por capa
| Capa | Herramienta | Qué se verifica |
|---|---|---|
| Función pura | `it` + `expect` | entradas y salidas |
| Hook | `renderHook` + `waitFor` | estado expuesto |
| Pantalla | `render` + `screen.getByRole/Text` + `fireEvent` | lo que el usuario ve y hace |
| API | `jest.mock` del client HTTP | URL y payload correctos |

## Ubicación y helpers
- Pruebas en `src/features/<feature>/__tests__/`, archivos `*.test.ts(x)`.
- Helpers en `src/test/` (créalos si no existen):
  - `renderWithProviders(ui, opts)`: envuelve en `QueryClientProvider` con `retry: false` y los stores.
  - `mockApi`: mock de `src/shared/api/client`.

## Reglas
- Se simula el client HTTP y los módulos nativos; nunca TanStack Query ni Zustand.
- Consultas por rol o texto accesible; `testID` solo si no hay alternativa.
- Asíncrono con `findBy...` o `waitFor`, sin `setTimeout`.
- Navegación: verifica el efecto (a qué ruta se pidió ir), no el árbol del navegador.
- Sin snapshots salvo que la task lo pida.
