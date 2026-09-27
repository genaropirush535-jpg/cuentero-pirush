# Cuentero

Aplicación móvil creada con Expo y React Native para guardar, leer, editar y eliminar cuentos.

## Funcionalidades

- Ver la lista de cuentos
- Crear nuevos cuentos
- Editar cuentos existentes
- Eliminar cuentos
- Persistencia local con SQLite (y respaldo web)

## Requisitos

- Node.js 22+
- npm
- Expo CLI

## Instalación

```bash
npm install
```

## Ejecutar la app

```bash
npm start
```

O directamente:

```bash
npm run web
```

## Estructura principal

- `app/` – pantallas de la app
- `lib/database.js` – acceso a datos
- `assets/` – imágenes e iconos

## Verificación

Se validó la compilación con:

```bash
npx expo export --platform web
```

La app compiló correctamente y generó la salida `dist`.
