import { firebaseApp, db } from "../config/firebase.js";

/**
 * Valida si una cédula está autorizada para registrarse.
 */
export async function validateCedula(cedula) {
  if (!cedula) {
    throw new Error("La cédula es obligatoria");
  }

  const normalizedCedula = String(cedula).trim();

  const doc = await db
    .collection("allowedUsers")
    .doc(normalizedCedula)
    .get();

  if (!doc.exists) {
    return {
      allowed: false,
    };
  }

  const data = doc.data();

  if (data.activo === false) {
    return {
      allowed: false,
    };
  }

  return {
    allowed: true,
    user: {
      cedula: normalizedCedula,
      ...data,
    },
  };
}


/**
 * Verifica el Firebase ID Token enviado por el frontend.
 */
export async function verifyIdToken(idToken) {
  if (!idToken) {
    throw new Error("ID Token requerido");
  }

  try {
    const decodedToken = await firebaseApp.auth().verifyIdToken(idToken);

    return decodedToken;
  } catch (error) {
    console.error("Error verificando Firebase Token:", error);

    throw new Error("Token inválido o expirado");
  }
}


/**
 * Obtiene el perfil de usuario desde Firestore.
 */
export async function getUserByUid(uid) {
  if (!uid) {
    throw new Error("UID requerido");
  }

  const doc = await db
    .collection("users")
    .doc(uid)
    .get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
}


/**
 * Crea o actualiza el perfil del usuario.
 */
export async function createOrUpdateUser({
  uid,
  cedula,
  phone,
}) {
  if (!uid || !cedula) {
    throw new Error("UID y cédula son obligatorios");
  }

  const userRef = db.collection("users").doc(uid);

  const existingUser = await userRef.get();

  const allowedUser = await db
    .collection("allowedUsers")
    .doc(String(cedula))
    .get();

  if (!allowedUser.exists) {
    throw new Error("La cédula no está autorizada");
  }

  const allowedData = allowedUser.data();

  const userData = {
    cedula: String(cedula),
    phone: phone || null,
    nombre: allowedData.nombre || null,
    updatedAt: firebaseApp.firestore.FieldValue.serverTimestamp(),
  };

  if (!existingUser.exists) {
    userData.createdAt =
      firebaseApp.firestore.FieldValue.serverTimestamp();
  }

  await userRef.set(userData, { merge: true });

  return {
    id: uid,
    ...userData,
  };
}


/**
 * Obtiene la información completa del usuario autenticado.
 */
export async function getCurrentUser(uid) {
  const user = await getUserByUid(uid);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
}