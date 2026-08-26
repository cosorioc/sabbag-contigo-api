import { auth } from "../config/firebase.js";

export async function authMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Token requerido",
      });
    }

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido",
      });
    }

    const token = authorization.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token requerido",
      });
    }

    const decodedToken = await auth.verifyIdToken(token);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Auth middleware:", error.message);

    return res.status(401).json({
      success: false,
      message: "Sesión inválida o expirada",
    });
  }
}