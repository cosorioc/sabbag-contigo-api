import rateLimit from "express-rate-limit";


export const generalRateLimit =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    max: 200,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Demasiadas solicitudes. Intenta nuevamente más tarde.",
    },
  });


export const authRateLimit =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    max: 20,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Demasiados intentos de autenticación.",
    },
  });


export const uploadRateLimit =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    max: 30,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Demasiadas cargas de imágenes.",
    },
  });