import { searchRepository } from "../repositories/search.repository.js";

export const searchSevice = async (search) => {
  // searching
  const searched = await searchRepository(search);

  return searched;
};
