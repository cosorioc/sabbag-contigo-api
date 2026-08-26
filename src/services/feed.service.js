import { db } from "../config/firebase.js";


/**
 * Obtiene el feed paginado.
 *
 * limit: máximo de publicaciones.
 * cursor: ID de la última publicación recibida.
 */
export async function getFeed({
  limit = 20,
  cursor = null,
  userId = null,
}) {
  const parsedLimit = Math.min(
    Math.max(Number(limit), 1),
    20
  );

  let query = db
    .collection("challengeSubmissions")
    .where("completed", "==", true)
    .orderBy("completedAt", "desc")
    .limit(parsedLimit);

  if (cursor) {
    const cursorDoc = await db
      .collection("challengeSubmissions")
      .doc(cursor)
      .get();

    if (!cursorDoc.exists) {
      throw new Error("Cursor inválido");
    }

    query = query.startAfter(cursorDoc);
  }

  const snapshot = await query.get();

  const items = [];

  for (const doc of snapshot.docs) {
    const submission = doc.data();

    const userDoc = await db
      .collection("users")
      .doc(submission.userId)
      .get();

    const challengeDoc = await db
      .collection("challenges")
      .doc(submission.challengeId)
      .get();

    const user = userDoc.exists
      ? userDoc.data()
      : {};

    const challenge = challengeDoc.exists
      ? challengeDoc.data()
      : {};

    items.push({
      id: doc.id,

      user: {
        id: submission.userId,
        name: user.nombre || "Usuario",
      },

      challenge: {
        id: submission.challengeId,
        title: challenge.title || "",
      },

      imagePath: submission.imagePath,

      likesCount: submission.likesCount || 0,

      createdAt: submission.completedAt,

      likedByMe: false,
    });
  }

  const nextCursor =
    snapshot.docs.length === parsedLimit
      ? snapshot.docs[snapshot.docs.length - 1].id
      : null;

  return {
    items,
    nextCursor,
  };
}