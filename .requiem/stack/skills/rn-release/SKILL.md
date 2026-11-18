---
name: rn-release
description: Úsala cuando la task toca versionado, firmas, builds de release o publicación en tiendas en react-native-bare.
---
# Release (RN CLI)

## Piezas
| Qué | iOS | Android |
|---|---|---|
| Versión visible | versión de marketing en el proyecto Xcode | `versionName` en `android/app/build.gradle` |
| Número de build | build number en el proyecto Xcode | `versionCode` en `android/app/build.gradle` |
| Firma | certificados y perfiles | keystore |
| Artefacto | archivo de Xcode | bundle o APK de Gradle |

La automatización (CI, scripts de release) la define cada proyecto: revisa qué existe en el repo antes de proponer comandos.

## Actualizaciones OTA
No se asume ninguna. Si el proyecto tiene un sistema de actualización OTA, estará documentado en su README; si no lo está, todo cambio sale con un build nuevo.

## Reglas
- Un agente no publica ni firma. No ejecutes builds de release ni subidas a tiendas: deja los cambios listos y entrega el comando al humano.
- Keystores, certificados y contraseñas nunca en el repo.
- Las dos plataformas suben versión en el mismo commit.
- Antes de proponer un release: checks en verde y lista de lo que cambió desde el release anterior.

## Salida esperada
```
Versión: <anterior> → <nueva> (iOS build <n>, Android versionCode <n>)
Cambios: <lista corta>
Cambios nativos: <sí/no, cuáles>
Pasos para el humano: <comandos o pipeline a lanzar>
```
