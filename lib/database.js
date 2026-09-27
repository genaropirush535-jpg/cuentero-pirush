import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

const webStorageKey = "cuentero.cuentos";
const db = Platform.OS === "web" ? null : SQLite.openDatabaseSync("cuentero.db");
const cuentoChullachaqui = {
  titulo: "La trampa del cazador",
  cuerpo:
    "En lo profundo de la Amazonía vive el Chullachaqui, protector de la fauna y la flora. Puede transformarse en una persona conocida para engañar a quienes se adentran en el monte, pero no logra ocultar su extraño pie izquierdo.\n\nUn día, Manuel, un cazador que solía cazar más animales de los necesarios, entró en la selva buscando alimento para su familia. Allí escuchó la voz de su compadre Carlos.\n\n—¡Manuel! Qué bueno encontrarte. Más allá vi una manada de sajinos. Sígueme y los atraparemos todos —le dijo.\n\nManuel lo siguió. Mientras avanzaban, la selva se volvió oscura y silenciosa. Empezó a sospechar porque Carlos caminaba muy rápido y nunca lo miraba de frente.\n\nAl descansar junto a un tronco, un rayo de sol iluminó el pie izquierdo de su compadre: tenía la pata de una cabra. Descubierto, el ser soltó una carcajada y se transformó en un anciano de ojos encendidos. Era el Chullachaqui.\n\nEl espíritu hizo que Manuel se perdiera en la selva. Días después, la comunidad lo encontró débil y desorientado. Desde entonces, Manuel dejó de cazar en exceso y aprendió a respetar los secretos del monte.",
};
const cuentoYacumama = {
  titulo: "La Yacumama, madre del agua",
  cuerpo:
    "La Yacumama, cuyo nombre significa «Madre del Agua» en quechua, es una boa milenaria y gigante que protege los ríos de la Amazonía peruana. Se oculta inmóvil en las profundidades y usa un poder hipnótico y una fuerza de aspiración descomunal para atraer a sus presas.\n\nLos pobladores respetan profundamente su territorio. Antes de navegar por las lagunas sagradas, advierten su presencia con sonidos de tambores o cuernos.",
};
const cuentoTuchi = {
  titulo: "Tuchi aprende a volar",
  cuerpo:
    "Tuchi vive feliz en su nido, pero se siente inseguro y prefiere quedarse refugiado en la comodidad de las ramas en lugar de abrir sus alas como los demás pájaros.\n\nUn día, sus amigos y su familia lo alientan a intentarlo, recordándole que nació para recorrer el cielo. Tras mucho dudarlo, Tuchi decide enfrentar su temor, se lanza al vacío y descubre la increíble sensación de volar.\n\nAl final, el pajarito comprende que el miedo es normal, pero que superarlo le permite disfrutar de la verdadera libertad.",
};

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

function agregarCuentosDeLaSelvaSiHaceFalta() {
  const cuentosNuevos = [
    { nombre: "cuento_chullachaqui", cuento: cuentoChullachaqui },
    { nombre: "cuento_yacumama", cuento: cuentoYacumama },
    { nombre: "cuento_tuchi", cuento: cuentoTuchi },
  ];

  if (Platform.OS === "web") {
    const cuentos = obtenerCuentosWeb();
    let huboCambios = false;

    for (const { nombre, cuento } of cuentosNuevos) {
      const claveMigracion = `cuentero.migration.${nombre.replace("cuento_", "")}`;
      if (localStorage.getItem(claveMigracion) !== null) continue;

      if (!cuentos.some((item) => item.titulo === cuento.titulo)) {
        const ahora = new Date().toISOString();
        const id = cuentos.length
          ? Math.max(...cuentos.map((item) => item.id)) + 1
          : 1;
        cuentos.push({ ...cuento, id, creado_en: ahora, editado_en: ahora });
        huboCambios = true;
      }

      localStorage.setItem(claveMigracion, "1");
    }

    if (huboCambios) guardarCuentosWeb(cuentos);
    return;
  }

  db.execSync(`
    CREATE TABLE IF NOT EXISTS app_migrations (
      name TEXT PRIMARY KEY NOT NULL
    );
  `);

  for (const { nombre, cuento } of cuentosNuevos) {
    const migracion = db.getFirstSync(
      "SELECT name FROM app_migrations WHERE name = ?",
      [nombre]
    );
    if (migracion) continue;

    const existe = db.getFirstSync(
      "SELECT id FROM cuentos WHERE titulo = ?",
      [cuento.titulo]
    );
    if (!existe) {
      db.runSync(
        "INSERT INTO cuentos (titulo, cuerpo) VALUES (?, ?)",
        [cuento.titulo, cuento.cuerpo]
      );
    }
    db.runSync("INSERT INTO app_migrations (name) VALUES (?)", [nombre]);
  }
}

export function prepararBaseDeDatos() {
  if (Platform.OS === "web") {
    if (localStorage.getItem(webStorageKey) === null) {
      guardarCuentosWeb([]);
    }
    eliminarCuentosNoDeseadosWeb();
    sembrarCuentosIniciales();
    agregarCuentosDeLaSelvaSiHaceFalta();
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
  agregarCuentosDeLaSelvaSiHaceFalta();
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