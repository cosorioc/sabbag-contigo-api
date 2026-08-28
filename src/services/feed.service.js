import { db, bucket } from "../config/firebase.js";

export async function getFeed({ limit = 20, cursor = null, userId = null }) {
  const parsedLimit = Math.min(Math.max(Number(limit), 1), 20);

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

    const [userDoc, challengeDoc] = await Promise.all([
      db.collection("users").doc(submission.userId).get(),

      db.collection("challenges").doc(submission.challengeId).get(),
    ]);

    const user = userDoc.exists ? userDoc.data() : {};

    const challenge = challengeDoc.exists ? challengeDoc.data() : {};

    let imageUrl = null;

    if (submission.imagePath) {
      const [url] = await bucket.file(submission.imagePath).getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60,
      });

      imageUrl = url;
    }

    let likedByMe = false;

    if (userId) {
      const likeId = `${doc.id}_${userId}`;

      const likeDoc = await db.collection("likes").doc(likeId).get();

      likedByMe = likeDoc.exists;
    }

    items.push({
      id: doc.id,

      user: {
        id: submission.userId,
        name: user.name || "Usuario",
      },

      challenge: {
        id: submission.challengeId,
        title: challenge.title || "",
      },

      imageUrl,

      likesCount: submission.likesCount || 0,

      createdAt: submission.completedAt,

      likedByMe,
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
