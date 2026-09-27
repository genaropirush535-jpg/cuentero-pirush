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

  const archivo = new Blob([generarMarkdown(cuentos)], {
    type: "text/markdown;charset=utf-8",
  });
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "cuentos.md";
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}