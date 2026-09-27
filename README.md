# Cuentero

Aplicación móvil para crear, leer, editar, eliminar y exportar cuentos de la selva. En Android e iOS, los cuentos se guardan localmente con SQLite y no requieren internet.

## Datos de entrega

- Estudiante: completar con el nombre del estudiante
- Repositorio: `cuentero-<apellido>` (falta confirmar el apellido)
- Expo SDK: 57

## Funcionalidades

- Lista ordenada por última edición, con fecha, vista previa y contador de cuentos
- Crear y editar cuentos con contador de palabras
- Confirmación antes de salir con cambios sin guardar
- Eliminar cuentos
- Exportar los cuentos a `cuentos.md` desde el menú de compartir del celular o descargarlos desde la web
- Persistencia móvil local con SQLite; la vista web usa almacenamiento del navegador

## Tareas

- [x] T1. Contador de cuentos en el encabezado
- [x] T2. Contador de palabras en el editor
- [x] T3. Vista previa de hasta 80 caracteres
- [x] T4. Confirmar salida con cambios sin guardar
- [ ] T5. Reemplazar los cuentos de ejemplo por tres cuentos recopilados por el estudiante, exportar `cuentos.md` e incluirlo en la entrega
- [ ] Capturas de la app funcionando en un celular real

## Requisitos

- Node.js 20 LTS o superior
- npm
- Expo Go en el celular
- Celular y computadora conectados a la misma red Wi-Fi

## Instalación y ejecución

```bash
npm install
npx expo start
```

Escanea el código QR con Expo Go. Para abrir la vista web en Chrome en Windows:

```bash
npm run web
```

## Exportar los cuentos

Pulsa **Exportar cuentos** en la pantalla principal. En el celular se genera y comparte `cuentos.md`; en la web se descarga ese archivo desde el navegador.

## Estructura

- `app/`: pantallas y rutas
- `lib/database.js`: persistencia SQLite y almacenamiento web
- `lib/exportarCuentos.native.js`: exportación móvil
- `lib/exportarCuentos.web.js`: descarga web
- `assets/`: imágenes e iconos

## Evidencias

Agregar aquí capturas tomadas en un celular real antes de entregar.
