---
name: rn-native
description: Úsala cuando la task necesita permisos, cambios en ios/ o android/, o una librería con código nativo en react-native-bare.
---
# Capa nativa (RN CLI)

## Principio
`ios/` y `android/` son código del proyecto. Se editan a mano, con cuidado y siempre dentro del plan: un error ahí no lo detectan las pruebas unitarias y rompe el build.

## Dónde se configura
| Necesidad | iOS | Android |
|---|---|---|
| Permisos | textos de uso en `Info.plist` | `<uses-permission>` en `AndroidManifest.xml` |
| Esquema de URL / deep links | URL types en `Info.plist` | `<intent-filter>` en `AndroidManifest.xml` |
| Identificador y versión | proyecto Xcode | `android/app/build.gradle` |
| Dependencias nativas | `Podfile` | Gradle |

## Agregar una librería con código nativo
1. Solo si el plan la incluye.
2. Instala el paquete; el autolinking la enlaza en ambas plataformas.
3. Sigue los pasos nativos que pida su documentación (permisos, inicialización). Consúltala antes; no asumas.
4. iOS necesita `pod install` y ambas plataformas un build nuevo: no los ejecutes, repórtalo al humano.
5. Confirma que es compatible con la versión de React Native y la arquitectura del proyecto.

## Permisos
- Pídelos en el momento en que se usan, no al iniciar la app.
- Maneja los tres casos: concedido, denegado, denegado de forma permanente (lleva a ajustes).
- Cada permiso nuevo necesita su texto de uso en iOS; sin él la tienda rechaza el build.

## Módulos nativos propios
- Solo si no existe una librería mantenida que lo resuelva, y siempre como task `[L]`.
- La interfaz hacia JavaScript se tipa y se envuelve en `src/shared/lib`; las features no llaman al módulo directo.

## Reglas
- Cambios nativos mínimos y en commits propios, separados del código JavaScript.
- No toques archivos generados ni carpetas de build (`Pods/`, `build/`).
- Secretos nunca en `Info.plist`, `AndroidManifest.xml` ni Gradle versionado.
- El reporte de la task lista cada archivo nativo tocado y por qué.
