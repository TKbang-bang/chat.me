import ServerError from "../error/ServerError.js";
import { createGroup } from "../repositories/group.repository.js";

export const createGroupService = async (name, description, userId) => {
  const group = await createGroup(name, description, userId);
  if (!group) throw new ServerError("Group not created", "group", 500);

  return group;
};
