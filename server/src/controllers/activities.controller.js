import {
  acceptRequestService,
  cancelRequestService,
  declineRequestService,
  getRequestsService,
  sendRequestService,
} from "../services/activities.service.js";

export const sendRequestController = async (req, res, next) => {
  try {
    const { id, type } = req.body;

    await sendRequestService(id, type, req.userId);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};

export const cancelRequestController = async (req, res, next) => {
  try {
    const { id, type } = req.body;

    await cancelRequestService(id, type, req.userId);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};

export const getRequestsController = async (req, res, next) => {
  try {
    const requests = await getRequestsService(req.userId);

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    return next(error);
  }
};

export const acceptRequestController = async (req, res, next) => {
  try {
    const { requestId, userId, type, chatId = null } = req.body;

    await acceptRequestService(requestId, userId, type, req.userId, chatId);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};
export const declineRequestController = async (req, res, next) => {
  try {
    const { requestId, userId, type } = req.body;

    await declineRequestService(requestId, userId, type, req.userId);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
};
