import { NextRequest } from "next/server";
import sharp from "sharp";
import { uploadFile } from "@/lib/storage";
import { apiSuccess, apiError, withAdmin } from "@/lib/api-helpers";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB (pre-conversion)

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "uploads";

      if (!file) {
        return apiError("No se proporcionó ningún archivo");
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return apiError(
          `Tipo de archivo no permitido. Permitidos: ${ALLOWED_TYPES.join(", ")}`,
        );
      }

      if (file.size > MAX_SIZE) {
        return apiError("El archivo excede el tamaño máximo de 10MB");
      }

      const rawBuffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const safeName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .toLowerCase();

      let finalBuffer: Buffer;
      let contentType: string;
      let ext: string;

      // SVGs stay as-is, everything else converts to AVIF
      if (file.type === "image/svg+xml") {
        finalBuffer = rawBuffer;
        contentType = "image/svg+xml";
        ext = "svg";
      } else {
        // Convert to AVIF with high quality
        finalBuffer = await sharp(rawBuffer)
          .avif({ quality: 80, effort: 4 })
          .toBuffer();
        contentType = "image/avif";
        ext = "avif";
      }

      const key = `multitienda/${folder}/${timestamp}-${safeName}.${ext}`;
      const url = await uploadFile(finalBuffer, key, contentType);

      return apiSuccess({
        url,
        key,
        originalSize: file.size,
        convertedSize: finalBuffer.length,
        savings: Math.round((1 - finalBuffer.length / file.size) * 100),
      });
    } catch (err) {
      return apiError(
        err instanceof Error ? err.message : "Error al subir archivo",
        500,
      );
    }
  });
}
