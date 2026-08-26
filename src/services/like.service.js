import { firebaseApp, db } from "../config/firebase.js";


/**
 * Da like a una publicación.
 */
export async function likeSubmission({
  submissionId,
  userId,
}) {
  if (!submissionId || !userId) {
    throw new Error(
      "submissionId y userId son obligatorios"
    );
  }

  const submissionRef = db
    .collection("challengeSubmissions")
    .doc(submissionId);

  const likeId = `${submissionId}_${userId}`;

  const likeRef = db
    .collection("likes")
    .doc(likeId);

  await db.runTransaction(async (transaction) => {
    const submissionDoc =
      await transaction.get(submissionRef);

    if (!submissionDoc.exists) {
      throw new Error("Publicación no encontrada");
    }

    const likeDoc =
      await transaction.get(likeRef);

    if (likeDoc.exists) {
      throw new Error("Ya has dado like");
    }

    transaction.set(likeRef, {
      submissionId,
      userId,
      createdAt:
        firebaseApp.firestore.FieldValue.serverTimestamp(),
    });

    transaction.update(submissionRef, {
      likesCount:
        firebaseApp.firestore.FieldValue.increment(1),
    });
  });

  return {
    liked: true,
  };
}


/**
 * Elimina un like.
 */
export async function unlikeSubmission({
  submissionId,
  userId,
}) {
  const submissionRef = db
    .collection("challengeSubmissions")
    .doc(submissionId);

  const likeId = `${submissionId}_${userId}`;

  const likeRef = db
    .collection("likes")
    .doc(likeId);

  await db.runTransaction(async (transaction) => {
    const submissionDoc =
      await transaction.get(submissionRef);

    if (!submissionDoc.exists) {
      throw new Error("Publicación no encontrada");
    }

    const likeDoc =
      await transaction.get(likeRef);

    if (!likeDoc.exists) {
      throw new Error("No has dado like");
    }

    transaction.delete(likeRef);

    transaction.update(submissionRef, {
      likesCount:
        firebaseApp.firestore.FieldValue.increment(-1),
    });
  });

  return {
    liked: false,
  };
}


/**
 * Comprueba si un usuario dio like.
 */
export async function hasLiked({
  submissionId,
  userId,
}) {
  const likeId = `${submissionId}_${userId}`;

  const doc = await db
    .collection("likes")
    .doc(likeId)
    .get();

  return doc.exists;
}