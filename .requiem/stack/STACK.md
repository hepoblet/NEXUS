# Stack: react-native-bare

App React Native con React Native CLI: las carpetas `ios/` y `android/` están versionadas y se editan directamente. Para Expo usa `react-native-expo`.

## Tecnologías
- React Native + TypeScript estricto. Las versiones exactas son las de `package.json`; no las cambies sin que el plan lo pida.
- Navegación: React Navigation (native stack y tabs)
- Estado servidor: TanStack Query. Estado cliente: Zustand, solo para lo que no viene del servidor
- HTTP: `fetch` envuelto en `src/shared/api/client.ts`
- Pruebas: Jest (preset `react-native`) + React Native Testing Library
- Lint / formato: ESLint + Prettier
- Build: Xcode y Gradle; la automatización de release la define el proyecto

## Arquitectura (feature-based)
```
index.js                  # registro de la app
src/
  app/                    # App.tsx, providers, navegador raíz
  navigation/             # navegadores, tipos de rutas, config de deep links
  features/<feature>/
    screens/              # pantallas, sin lógica de negocio
    components/           # UI de la feature
    hooks/                # lógica (use-*.ts)
    api/                  # queries/mutations + tipos de respuesta
    store/                # slice de Zustand si hace falta
    __tests__/
    index.ts              # API pública de la feature
  shared/
    ui/                   # design system
    api/                  # client, errores
    lib/                  # utilidades puras
    config/               # env, constantes
ios/                      # proyecto Xcode
android/                  # proyecto Gradle
```

## Reglas
- Una feature no importa internals de otra: solo `src/shared` o el `index.ts` de la otra.
- Lógica de negocio en hooks o funciones puras, nunca en componentes ni en navegadores.
- Sin `any`, sin `@ts-ignore`, sin `console.log` en código commiteado.
- Componentes funcionales con props tipadas y exports con nombre.
- Todo cambio en `ios/` o `android/` es task `[L]`, va en el plan y se explica en el reporte: las pruebas unitarias no lo cubren.
- Dependencias con código nativo solo si el plan lo indica.
- Secretos fuera del repo y fuera del bundle.

## Procesos
- No ejecutes metro, `run-android`, `run-ios`, `pod install` ni builds: los corre el humano o `hc`. Si la task los necesita, repórtalo.
- Pruebas siempre con `--ci`, nunca en modo watch.

## Skills del stack (`.requiem/stack/skills/`)
Lee solo la que la task necesite:
- `rn-arch`: al planificar o implementar una feature.
- `rn-testing`: al escribir pruebas.
- `rn-navigation`: navegadores, tipos de rutas, params, deep links.
- `rn-native`: permisos, `Info.plist`, `AndroidManifest.xml`, módulos nativos.
- `rn-release`: versionado, firmas, builds, publicación.
- `rn-performance`: listas, re-renders, imágenes, arranque.
