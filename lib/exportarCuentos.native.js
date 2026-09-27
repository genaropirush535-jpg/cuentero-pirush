import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

function generarMarkdown(cuentos) {
  return [...cuentos]
    .sort((primero, segundo) =>
      primero.creado_en.localeCompare(segundo.creado_en)
    )
    .map(
      (cuento) =>
        `# ${cuento.titulo}\n(${cuento.creado_en.slice(0, 10)})\n\n${cuento.cuerpo}`
    )
    .join("\n\n---\n\n");
}

export async function exportarCuentos(cuentos) {
  if (cuentos.length === 0) {
    throw new Error("No hay cuentos para exportar.");
  }

  const archivo = new File(Paths.document, "cuentos.md");
  if (archivo.exists) {
    archivo.delete();
  }
  archivo.create();
  archivo.write(generarMarkdown(cuentos));

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("La función de compartir no está disponible.");
  }

  await Sharing.shareAsync(archivo.uri, {
    dialogTitle: "Exportar cuentos",
    mimeType: "text/markdown",
  });
}