export function errorMiddleware(
  error,
  req,
  res,
  next
) {
  console.error(
    "API ERROR:",
    error
  );

  // Multer
  if (
    error.name ===
    "MulterError"
  ) {
    if (
      error.code ===
      "LIMIT_FILE_SIZE"
    ) {
      return res.status(413).json({
        success: false,
        message:
          "La imagen supera el tamaño máximo permitido",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // Error de formato de imagen
  if (
    error.message ===
    "Formato de imagen no permitido"
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // Error genérico
  return res.status(500).json({
    success: false,
    message:
      "Error interno del servidor",
  });
}