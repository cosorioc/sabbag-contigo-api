import { db, FieldValue } from "../config/firebase.js";

export async function updateRanking({
  userId,
  completionTime,
}) {
  if (!userId) {
    throw new Error("userId es obligatorio");
  }

  if (
    completionTime === undefined ||
    completionTime === null ||
    completionTime < 0
  ) {
    throw new Error(
      "completionTime es obligatorio y debe ser válido"
    );
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
        totalTime: completionTime,
        updatedAt:
          FieldValue.serverTimestamp(),
      });

      return;
    }

    const current = rankingDoc.data();

    transaction.update(rankingRef, {
      completedChallenges:
        (current.completedChallenges || 0) + 1,

      totalTime:
        (current.totalTime || 0) + completionTime,

      updatedAt:
        FieldValue.serverTimestamp(),
    });
  });

  return getRankingPosition(userId);
}


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

  const ranking = await Promise.all(
    snapshot.docs.map(
      async (doc, index) => {
        const data = doc.data();

        const userDoc = await db
          .collection("users")
          .doc(data.userId)
          .get();

        const user = userDoc.exists
          ? userDoc.data()
          : {};

        return {
          position: index + 1,

          userId: data.userId,

          name:
            user.name || "Usuario",

          completedChallenges:
            data.completedChallenges || 0,

          totalTime:
            data.totalTime || 0,
        };
      }
    )
  );

  return ranking;
}


export async function getRankingPosition(userId) {
  if (!userId) {
    throw new Error("userId es obligatorio");
  }

  const userRankingRef = db
    .collection("ranking")
    .doc(userId);

  const userRankingDoc =
    await userRankingRef.get();

  if (!userRankingDoc.exists) {
    return {
      position: null,
      userId,
      completedChallenges: 0,
      totalTime: 0,
    };
  }

  const userData =
    userRankingDoc.data();

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
    .get();

  let position = null;

  snapshot.docs.forEach((doc, index) => {
    if (doc.id === userId) {
      position = index + 1;
    }
  });

  return {
    position,

    userId,

    completedChallenges:
      userData.completedChallenges || 0,

    totalTime:
      userData.totalTime || 0,
  };
}