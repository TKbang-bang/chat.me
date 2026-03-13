import ServerError from "../error/ServerError.js";
import {
  acceptGroupRequest,
  acceptUserRequest,
  cancelGroupRequest,
  cancelUserRequest,
  declineGroupRequests,
  declineUsersRequests,
  getGroupRequest,
  getRequests,
  getUserRequest,
  sendGroupRequest,
  sendUserRequest,
} from "../repositories/activities.repository.js";
import { getGroupChatById } from "../repositories/group.repository.js";
import { getUserById } from "../repositories/users.repository.js";

export const sendRequestService = async (toId, type, myId) => {
  if (type == "direct") {
    // verify if the user is in db
    const user = await getUserById(toId);
    if (!user) throw new ServerError("User not found", "user", 404);

    // verify if the has already sent a request to the user
    const request = await getUserRequest(myId, toId);
    if (request) throw new ServerError("Request already sent", "request", 400);

    // send request
    await sendUserRequest(myId, toId);
    return;
  } else if (type == "group") {
    // verify if the group does exist in db
    const group = await getGroupChatById(toId);
    if (!group) throw new ServerError("Group not found", "group", 404);

    // verify if the user has already sent a request to the group
    const request = await getGroupRequest(myId, toId);
    if (request) throw new ServerError("Request already sent", "request", 400);

    // send request
    await sendGroupRequest(myId, toId);
    return;
  } else {
    throw new ServerError("Invalid chat type", "type", 400);
  }
};

export const cancelRequestService = async (toId, type, myId) => {
  if (type == "direct") {
    await cancelUserRequest(myId, toId);
  } else if (type == "group") {
    await cancelGroupRequest(myId, toId);
  } else {
    throw new ServerError("Invalid chat type", "type", 400);
  }
};

export const getRequestsService = async (myId) => {
  return await getRequests(myId);
};

export const acceptRequestService = async (
  requestId,
  userId,
  type,
  myId,
  chatId,
) => {
  if (type == "direct") {
    // verify if request exists
    const request = await getUserRequest(userId, myId);
    if (!request) throw new ServerError("Request not found", "request", 404);

    console.log(
      { userId, myId },
      { sender: request.sender_id, receiver: request.receiver_id },
    );

    if (request.sender_id != userId || request.receiver_id != myId)
      throw new ServerError("Inconsistent request", "request", 400);

    // accept request and create chat
    await acceptUserRequest(requestId, userId, myId);
  } else if (type == "group") {
    // verify if request exists
    const request = await getGroupRequest(userId, chatId);
    if (!request) throw new ServerError("Request not found", "request", 404);

    if (request.sender_id != userId)
      throw new ServerError("Inconsistent request", "request", 400);

    // accept request and create chat
    await acceptGroupRequest(requestId, userId, chatId);
  } else {
    throw new ServerError("Invalid chat type", "type", 400);
  }

  return;
};

export const declineRequestService = async (
  requestId,
  senderId,
  type,
  myId,
) => {
  if (type == "direct") {
    await declineUsersRequests(requestId, senderId, myId);
  } else if (type == "group") {
    await declineGroupRequests(requestId, senderId);
  } else {
    throw new ServerError("Invalid chat type", "type", 400);
  }
};
