import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

const webStorageKey = "cuentero.cuentos";
const db = Platform.OS === "web" ? null : SQLite.openDatabaseSync("cuentero.db");

const cuentosIniciales = [
  {
    id: 1,
    titulo: "El delfín rosado",
    cuerpo:
      "En la orilla del río, un delfín rosado nadaba con la luz del amanecer. Todos los animales lo admiraban porque brillaba como un pequeño sol en el agua.",
    creado_en: new Date().toISOString(),
    editado_en: new Date().toISOString(),
  },
  {
    id: 2,
    titulo: "La anaconda",
    cuerpo:
      "La anaconda dormía bajo la sombra de los árboles y vigilaba el río con calma. Cuando el sol bajó, ella se deslizó entre las hojas como una sombra silenciosa.",
    creado_en: new Date().toISOString(),
    editado_en: new Date().toISOString(),
  },
  {
    id: 3,
    titulo: "La taricaya",
    cuerpo:
      "La taricaya crecía junto a la laguna y sus flores se abrían con cada amanecer. Los pájaros cantaban alrededor y el agua reflejaba su belleza en silencio.",
    creado_en: new Date().toISOString(),
    editado_en: new Date().toISOString(),
  },
];

function obtenerCuentosWeb() {
  return JSON.parse(localStorage.getItem(webStorageKey) || "[]");
}

function guardarCuentosWeb(cuentos) {
  localStorage.setItem(webStorageKey, JSON.stringify(cuentos));
}

function eliminarCuentosNoDeseadosWeb() {
  guardarCuentosWeb(
    obtenerCuentosWeb().filter(
      (cuento) =>
        cuento.titulo !== "El oso perezoso" &&
        cuento.titulo !== "La leyenda del río Amazonas"
    )
  );
}

function sembrarCuentosIniciales() {
  if (Platform.OS === "web") {
    const cuentos = obtenerCuentosWeb();

    if (cuentos.length === 0) {
      guardarCuentosWeb(cuentosIniciales);
    }

    return;
  }

  const cantidad = db.getFirstSync(`SELECT COUNT(*) AS total FROM cuentos`)?.total ?? 0;

  if (cantidad === 0) {
    db.runSync(
      `
      INSERT INTO cuentos (titulo, cuerpo, creado_en, editado_en)
      VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)
      `,
      [
        "El delfín rosado",
        "En la orilla del río, un delfín rosado nadaba con la luz del amanecer. Todos los animales lo admiraban porque brillaba como un pequeño sol en el agua.",
        new Date().toISOString(),
        new Date().toISOString(),
        "La anaconda",
        "La anaconda dormía bajo la sombra de los árboles y vigilaba el río con calma. Cuando el sol bajó, ella se deslizó entre las hojas como una sombra silenciosa.",
        new Date().toISOString(),
        new Date().toISOString(),
        "La taricaya",
        "La taricaya crecía junto a la laguna y sus flores se abrían con cada amanecer. Los pájaros cantaban alrededor y el agua reflejaba su belleza en silencio.",
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );
  }
}

export function prepararBaseDeDatos() {
  if (Platform.OS === "web") {
    if (localStorage.getItem(webStorageKey) === null) {
      guardarCuentosWeb([]);
    }
    eliminarCuentosNoDeseadosWeb();
    sembrarCuentosIniciales();
    return;
  }

  db.execSync(`
    CREATE TABLE IF NOT EXISTS cuentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      cuerpo TEXT NOT NULL,
      creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      editado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.runSync(
    "DELETE FROM cuentos WHERE titulo IN (?, ?)",
    ["El oso perezoso", "La leyenda del río Amazonas"]
  );

  sembrarCuentosIniciales();
}

export function obtenerCuentos() {
  if (Platform.OS === "web") {
    return obtenerCuentosWeb().sort((a, b) =>
      b.editado_en.localeCompare(a.editado_en)
    );
  }

  return db.getAllSync(`
    SELECT *
    FROM cuentos
    ORDER BY editado_en DESC
  `);
}

export function obtenerCuento(id) {
  if (Platform.OS === "web") {
    return obtenerCuentosWeb().find((cuento) => cuento.id === Number(id)) || null;
  }

  return db.getFirstSync(
    `
    SELECT *
    FROM cuentos
    WHERE id = ?
    `,
    [id]
  );
}

export function crearCuento(titulo, cuerpo) {
  if (Platform.OS === "web") {
    const cuentos = obtenerCuentosWeb();
    const ahora = new Date().toISOString();
    const id = cuentos.length ? Math.max(...cuentos.map((cuento) => cuento.id)) + 1 : 1;
    cuentos.push({ id, titulo, cuerpo, creado_en: ahora, editado_en: ahora });
    guardarCuentosWeb(cuentos);
    return;
  }

  db.runSync(
    `
    INSERT INTO cuentos (titulo, cuerpo)
    VALUES (?, ?)
    `,
    [titulo, cuerpo]
  );
}

export function actualizarCuento(id, titulo, cuerpo) {
  if (Platform.OS === "web") {
    const cuentos = obtenerCuentosWeb();
    const cuento = cuentos.find((item) => item.id === Number(id));
    if (cuento) {
      cuento.titulo = titulo;
      cuento.cuerpo = cuerpo;
      cuento.editado_en = new Date().toISOString();
      guardarCuentosWeb(cuentos);
    }
    return;
  }

  db.runSync(
    `
    UPDATE cuentos
    SET titulo = ?,
        cuerpo = ?,
        editado_en = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [titulo, cuerpo, id]
  );
}

export function eliminarCuento(id) {
  if (Platform.OS === "web") {
    guardarCuentosWeb(
      obtenerCuentosWeb().filter((cuento) => cuento.id !== Number(id))
    );
    return;
  }

  db.runSync(
    `
    DELETE FROM cuentos
    WHERE id = ?
    `,
    [id]
  );
}