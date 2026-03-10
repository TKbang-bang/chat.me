export const searchController = async (req, res, next) => {
  try {
    const { search } = req.params;

    console.log({ search });

    return res.status(200).json({ success: true, data: { search } });
  } catch (error) {
    return next(error);
  }
};
