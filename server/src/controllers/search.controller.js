import { searchSevice } from "../services/search.service.js";

export const searchController = async (req, res, next) => {
  try {
    const { search } = req.params;

    const searched = await searchSevice(search, req.userId);

    return res.status(200).json({ success: true, data: searched });
  } catch (error) {
    return next(error);
  }
};
