export function validateChallengeId(
  req,
  res,
  next
) {
  const { challengeId } = req.params;

  if (!challengeId) {
    return res.status(400).json({
      success: false,
      message: "challengeId es obligatorio",
    });
  }

  next();
}

export function validateCedula(
  req,
  res,
  next
) {
  const { cedula } = req.body;

  if (!cedula) {
    return res.status(400).json({
      success: false,
      message: "La cédula es obligatoria",
    });
  }

  const normalized =
    String(cedula).trim();

  if (!/^\d+$/.test(normalized)) {
    return res.status(400).json({
      success: false,
      message:
        "La cédula debe contener únicamente números",
    });
  }

  req.body.cedula = normalized;

  next();
}