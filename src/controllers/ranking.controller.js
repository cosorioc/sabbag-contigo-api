import {
  getRanking,
  getRankingPosition,
} from "../services/ranking.service.js";


export async function getRankingController(
  req,
  res,
  next
) {
  try {
    const limit =
      req.query.limit || 20;

    const ranking =
      await getRanking(limit);

    return res.status(200).json({
      success: true,
      ranking,
    });
  } catch (error) {
    next(error);
  }
}


export async function getMyRanking(
  req,
  res,
  next
) {
  try {
    const result =
      await getRankingPosition(
        req.user.uid
      );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}