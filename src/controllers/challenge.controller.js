import {
  getChallenges,
  getChallengeById,
  getUserChallenges,
  submitChallenge,
} from "../services/challenge.service.js";

import { uploadChallengeImages } from "../services/storage.service.js";

export async function getAllChallenges(req, res, next) {
  try {
    const challenges = await getChallenges();

    return res.status(200).json({
      success: true,
      challenges,
    });
  } catch (error) {
    next(error);
  }
}

export async function getChallenge(req, res, next) {
  try {
    const { challengeId } = req.params;

    const challenge = await getChallengeById(challengeId);

    return res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyChallenges(req, res, next) {
  try {
    const challenges = await getUserChallenges(req.user.uid);

    return res.status(200).json({
      success: true,
      challenges,
    });
  } catch (error) {
    next(error);
  }
}

export async function completeChallenge(req, res, next) {
  try {
    const { challengeId } = req.params;

    const userId = req.user.uid;

    const challenge = await getChallengeById(challengeId);

    if (!challenge.active) {
      return res.status(400).json({
        success: false,
        message: "Este reto no está disponible",
      });
    }

    if (challenge.requiresEvidence === false) {
      return res.status(400).json({
        success: false,
        message:
          "Este reto se completa automáticamente al cumplir su condición.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "La imagen es obligatoria",
      });
    }

    const images = await uploadChallengeImages({
      buffer: req.file.buffer,
      userId,
      challengeId,
    });

    const submission = await submitChallenge({
      userId,
      challengeId,

      imagePath: images.feedPath,

      thumbnailPath: images.thumbnailPath,
    });

    return res.status(201).json({
      success: true,

      message: "Reto completado correctamente",

      submission,
    });
  } catch (error) {
    next(error);
  }
}
