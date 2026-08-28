import {
  likeSubmission,
  unlikeSubmission,
  hasLiked,
  getMyLikesCount,
} from "../services/like.service.js";

export async function likePost(req, res, next) {
  try {
    const { submissionId } = req.params;

    const result = await likeSubmission({
      submissionId,
      userId: req.user.uid,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function unlikePost(req, res, next) {
  try {
    const { submissionId } = req.params;

    const result = await unlikeSubmission({
      submissionId,
      userId: req.user.uid,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function checkLike(req, res, next) {
  try {
    const { submissionId } = req.params;

    const liked = await hasLiked({
      submissionId,
      userId: req.user.uid,
    });

    return res.status(200).json({
      success: true,
      liked,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyLikes(req, res, next) {
  try {
    const count = await getMyLikesCount(req.user.uid);

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    next(error);
  }
}
