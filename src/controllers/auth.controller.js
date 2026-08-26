import {
  validateCedula as validateCedulaService,
  createOrUpdateUser,
  getCurrentUser,
} from "../services/auth.service.js";


export async function validateCedula(req, res, next) {
  try {
    const { cedula } = req.body;

    const result =
      await validateCedulaService(cedula);

    if (!result.allowed) {
      return res.status(403).json({
        success: false,
        message: "Cédula no autorizada",
      });
    }

    return res.status(200).json({
      success: true,
      allowed: true,
      user: result.user,
    });

  } catch (error) {
    next(error);
  }
}


export async function registerUser(req, res, next) {
  try {
    const { cedula, phone } = req.body;

    const user = await createOrUpdateUser({
      uid: req.user.uid,
      cedula,
      phone,
    });

    return res.status(201).json({
      success: true,
      user,
    });

  } catch (error) {
    next(error);
  }
}


export async function getMe(req, res, next) {
  try {
    const user =
      await getCurrentUser(req.user.uid);

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    next(error);
  }
}