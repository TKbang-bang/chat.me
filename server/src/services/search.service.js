import { searchRepository } from "../repositories/search.repository.js";

export const searchSevice = async (search, userId) => {
  // searching
  const searched = await searchRepository(search, userId);

  return searched;
};
