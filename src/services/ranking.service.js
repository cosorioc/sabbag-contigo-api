import { firebaseApp, db } from "../config/firebase.js";


/**
 * Actualiza el ranking cuando un usuario
 * completa un reto.
 */
export async function updateRanking({
  userId,
  completionTime,
}) {
  if (!userId) {
    throw new Error("userId es obligatorio");
  }

  const rankingRef = db
    .collection("ranking")
    .doc(userId);

  await db.runTransaction(async (transaction) => {
    const rankingDoc =
      await transaction.get(rankingRef);

    if (!rankingDoc.exists) {
      transaction.set(rankingRef, {
        userId,
        completedChallenges: 1,
        totalTime: completionTime || 0,
        updatedAt:
          firebaseApp.firestore.FieldValue.serverTimestamp(),
      });

      return;
    }

    const current = rankingDoc.data();

    transaction.update(rankingRef, {
      completedChallenges:
        (current.completedChallenges || 0) + 1,

      totalTime:
        (current.totalTime || 0) +
        (completionTime || 0),

      updatedAt:
        firebaseApp.firestore.FieldValue.serverTimestamp(),
    });
  });

  return getRankingPosition(userId);
}


/**
 * Obtiene el ranking.
 */
export async function getRanking(limit = 20) {
  const parsedLimit = Math.min(
    Math.max(Number(limit), 1),
    20
  );

  const snapshot = await db
    .collection("ranking")
    .orderBy(
      "completedChallenges",
      "desc"
    )
    .orderBy(
      "totalTime",
      "asc"
    )
    .limit(parsedLimit)
    .get();

  return snapshot.docs.map((doc, index) => ({
    position: index + 1,
    id: doc.id,
    ...doc.data(),
  }));
}


/**
 * Obtiene la posición aproximada de un usuario.
 */
export async function getRankingPosition(userId) {
  const ranking = await getRanking(20);

  const position = ranking.findIndex(
    (user) => user.userId === userId
  );

  return {
    position:
      position === -1
        ? null
        : position + 1,
  };
}