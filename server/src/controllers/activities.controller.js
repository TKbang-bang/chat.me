import {
  cancelRequestService,
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
