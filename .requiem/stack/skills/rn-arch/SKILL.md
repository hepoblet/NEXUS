---
name: rn-arch
description: Úsala al planificar o implementar una feature en react-native-bare. Indica dónde va cada cosa y los patrones de API, hooks, stores y pantallas.
---
# Arquitectura (RN CLI, feature-based)

## Dónde va cada cosa
| Qué | Dónde |
|---|---|
| Registro de pantalla en un navegador | `src/navigation/` |
| Pantalla | `src/features/<f>/screens/` |
| Comportamiento | `src/features/<f>/hooks/use-*.ts` |
| Llamadas HTTP y tipos | `src/features/<f>/api/` |
| Estado cliente | `src/features/<f>/store/` (solo si no es estado servidor) |
| UI reutilizable | `src/shared/ui/` |
| Client HTTP | `src/shared/api/client.ts` |
| Providers globales | `src/app/` |

## Patrones
```ts
// api: pure function + query key
export const ordersKeys = { all: ['orders'] as const };
export async function fetchOrders(): Promise<Order[]> { return api.get('/orders'); }

// hook: wraps TanStack Query, exposes only what the screen needs
export function useOrders() {
  const q = useQuery({ queryKey: ordersKeys.all, queryFn: fetchOrders });
  return { orders: q.data ?? [], isLoading: q.isPending, error: q.error };
}

// screen: no logic
export function OrdersScreen() {
  const { orders, isLoading } = useOrders();
  if (isLoading) return <Screen.Loading />;
  return <Screen><OrderList orders={orders} /></Screen>;
}
```

## Reglas
- Zustand: un store por feature, leído con selectores (`useStore(s => s.x)`); nunca cachear ahí respuestas del servidor.
- Mutaciones: invalidan las query keys afectadas; no actualices listas a mano salvo que el plan pida actualización optimista.
- Errores: el hook expone `error`; la pantalla decide cómo mostrarlo. No los tragues.
- Cada feature exporta su API pública en `index.ts`; los navegadores importan las pantallas desde ahí.
- El código específico de plataforma va en archivos `.ios.tsx` / `.android.tsx` o detrás de una función en `src/shared/lib`, no con condicionales repartidos por las pantallas.

## Antes de dar la task por terminada
- [ ] Lógica en hooks o funciones, no en JSX
- [ ] Sin imports cruzados entre features
- [ ] Sin `any`, `@ts-ignore` ni `console.log`
- [ ] Checks del stack en verde
