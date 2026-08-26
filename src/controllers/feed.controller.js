import {
  getFeed,
} from "../services/feed.service.js";


export async function getFeedController(
  req,
  res,
  next
) {
  try {
    const {
      limit = 20,
      cursor = null,
    } = req.query;

    const result =
      await getFeed({
        limit,
        cursor,
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