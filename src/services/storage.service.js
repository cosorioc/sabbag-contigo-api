import sharp from "sharp";
import { bucket } from "../config/firebase.js";

/**
 * Configuración de imágenes
 */
const IMAGE_CONFIG = {
  feed: {
    width: 1080,
    quality: 82,
  },

  thumbnail: {
    width: 400,
    quality: 75,
  },
};


/**
 * Procesa una imagen para el feed.
 *
 * @param {Buffer} buffer
 * @returns {Promise<Buffer>}
 */
export async function processFeedImage(buffer) {
  return sharp(buffer)
    .rotate()
    .resize({
      width: IMAGE_CONFIG.feed.width,
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({
      quality: IMAGE_CONFIG.feed.quality,
      effort: 5,
    })
    .toBuffer();
}


/**
 * Genera thumbnail.
 *
 * @param {Buffer} buffer
 * @returns {Promise<Buffer>}
 */
export async function processThumbnail(buffer) {
  return sharp(buffer)
    .rotate()
    .resize({
      width: IMAGE_CONFIG.thumbnail.width,
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({
      quality: IMAGE_CONFIG.thumbnail.quality,
      effort: 5,
    })
    .toBuffer();
}


/**
 * Sube un buffer a Firebase Storage.
 *
 * @param {Buffer} buffer
 * @param {string} path
 * @param {string} contentType
 */
export async function uploadBuffer(
  buffer,
  path,
  contentType = "image/webp"
) {
  const file = bucket.file(path);

  await file.save(buffer, {
    metadata: {
      contentType,

      cacheControl:
        "public,max-age=31536000,immutable",
    },

    resumable: false,
  });

  return path;
}


/**
 * Sube una imagen completa y su thumbnail.
 *
 * @param {Object} params
 */
export async function uploadChallengeImages({
  buffer,
  userId,
  challengeId,
}) {
  if (!buffer) {
    throw new Error("La imagen es obligatoria");
  }

  if (!userId) {
    throw new Error("userId es obligatorio");
  }

  if (!challengeId) {
    throw new Error("challengeId es obligatorio");
  }

  const feedImage =
    await processFeedImage(buffer);

  const thumbnail =
    await processThumbnail(buffer);

  const basePath =
    `challenges/${challengeId}/${userId}`;

  const feedPath =
    `${basePath}/feed.webp`;

  const thumbnailPath =
    `${basePath}/thumbnail.webp`;

  await Promise.all([
    uploadBuffer(
      feedImage,
      feedPath
    ),

    uploadBuffer(
      thumbnail,
      thumbnailPath
    ),
  ]);

  return {
    feedPath,
    thumbnailPath,

    feedSize: feedImage.length,
    thumbnailSize: thumbnail.length,
  };
}


/**
 * Elimina un archivo de Firebase Storage.
 */
export async function deleteFile(path) {
  if (!path) return;

  const file = bucket.file(path);

  const [exists] = await file.exists();

  if (!exists) {
    return;
  }

  await file.delete();
}


/**
 * Elimina todas las imágenes asociadas
 * a un reto de un usuario.
 */
export async function deleteChallengeImages({
  userId,
  challengeId,
}) {
  const basePath =
    `challenges/${challengeId}/${userId}`;

  await Promise.all([
    deleteFile(
      `${basePath}/feed.webp`
    ),

    deleteFile(
      `${basePath}/thumbnail.webp`
    ),
  ]);
}