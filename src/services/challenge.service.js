import { firebaseApp, db, bucket } from "../config/firebase.js";

/**
 * Obtiene todos los retos activos.
 */
export async function getChallenges() {
  const snapshot = await db
    .collection("challenges")
    .where("active", "==", true)
    .orderBy("order", "asc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Obtiene un reto específico.
 */
export async function getChallengeById(challengeId) {
  const doc = await db.collection("challenges").doc(challengeId).get();

  if (!doc.exists) {
    throw new Error("Reto no encontrado");
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
}

/**
 * Obtiene la participación de un usuario en un reto.
 */
export async function getUserChallenge(userId, challengeId) {
  const id = `${userId}_${challengeId}`;

  const doc = await db.collection("challengeSubmissions").doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
}

/**
 * Obtiene todos los retos realizados por un usuario.
 */
export async function getUserChallenges(userId) {
  const snapshot = await db
    .collection("challengeSubmissions")
    .where("userId", "==", userId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Registra la participación en un reto.
 *
 * imageBuffer:
 * Buffer generado por Sharp.
 */
export async function submitChallenge({
  userId,
  challengeId,
  imagePath,
  thumbnailPath,
}) {
  if (!userId || !challengeId || !imagePath) {
    throw new Error("Datos incompletos");
  }

  const challenge = await getChallengeById(challengeId);

  if (!challenge.active) {
    throw new Error("Este reto no está disponible");
  }

  const submissionId = `${userId}_${challengeId}`;

  const submissionRef = db.collection("challengeSubmissions").doc(submissionId);

  const existing = await submissionRef.get();

  if (existing.exists) {
    throw new Error("Ya completaste este reto");
  }

  const now = firebaseApp.firestore.FieldValue.serverTimestamp();

  await submissionRef.set({
    userId,
    challengeId,

    completed: true,

    imagePath,
    thumbnailPath,

    likesCount: 0,

    createdAt: now,
    completedAt: now,
  });

  return {
    id: submissionId,
    userId,
    challengeId,
    imagePath,
    thumbnailPath,
    completed: true,
  };
}
