import { db, FieldValue } from "../config/firebase.js";
import { updateRanking } from "./ranking.service.js";

const CHALLENGES_START_DATE = new Date("2026-08-01T00:00:00-05:00");

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

export async function getChallengeById(challengeId) {
  if (!challengeId) {
    throw new Error("challengeId es obligatorio");
  }

  const doc = await db.collection("challenges").doc(String(challengeId)).get();

  if (!doc.exists) {
    throw new Error("Reto no encontrado");
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
}

export async function getUserChallenge(userId, challengeId) {
  if (!userId || !challengeId) {
    throw new Error("userId y challengeId son obligatorios");
  }

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

export async function getUserChallenges(userId) {
  if (!userId) {
    throw new Error("userId es obligatorio");
  }

  const snapshot = await db
    .collection("challengeSubmissions")
    .where("userId", "==", userId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function submitChallenge({
  userId,
  challengeId,
  imagePath,
  thumbnailPath,
}) {
  if (!userId || !challengeId) {
    throw new Error("userId y challengeId son obligatorios");
  }

  const challenge = await getChallengeById(challengeId);

  if (!challenge.active) {
    throw new Error("Este reto no está disponible");
  }

  if (challenge.requiresEvidence !== false && !imagePath) {
    throw new Error("La evidencia del reto es obligatoria");
  }

  if (challenge.requiresEvidence === false) {
    throw new Error(
      "Este reto no requiere evidencia y se completa mediante su propia condición",
    );
  }

  const now = new Date();

  if (now < CHALLENGES_START_DATE) {
    throw new Error("Los retos todavía no han comenzado");
  }

  const submissionId = `${userId}_${challengeId}`;

  const submissionRef = db.collection("challengeSubmissions").doc(submissionId);

  const existing = await submissionRef.get();

  if (existing.exists) {
    throw new Error("Ya completaste este reto");
  }

  const completionTime = Math.floor(
    (now.getTime() - CHALLENGES_START_DATE.getTime()) / 1000,
  );

  const timestamp = FieldValue.serverTimestamp();

  await submissionRef.set({
    userId,
    challengeId: String(challengeId),

    completed: true,

    imagePath: imagePath || null,
    thumbnailPath: thumbnailPath || null,

    likesCount: 0,

    completionTime,

    createdAt: timestamp,
    completedAt: timestamp,
  });

  await updateRanking({
    userId,
    completionTime,
  });

  return {
    id: submissionId,

    userId,
    challengeId: String(challengeId),

    completed: true,

    imagePath: imagePath || null,
    thumbnailPath: thumbnailPath || null,

    likesCount: 0,

    completionTime,
  };
}
