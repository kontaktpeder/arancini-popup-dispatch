/** Normaliser kamerafil til JPEG for stabil preview + AI (HEIC etc.) */
export async function normalizeReceiptFile(file: File): Promise<File> {
  if (file.type === "application/pdf") return file;
  if (/^image\/(jpeg|png|webp)$/i.test(file.type)) return file;

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Konvertering feilet"))),
      "image/jpeg",
      0.92,
    ),
  );
  const base = file.name.replace(/\.[^.]+$/, "") || "kvittering";
  return new File([blob], `${base}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
