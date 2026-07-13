import express from "express";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../Controllers/NotificationController.js";

const router = express.Router();

router.get('/:userId', getNotifications);
router.put('/:id/read', markNotificationAsRead);
router.put('/:userId/read-all', markAllNotificationsAsRead);

export default router;
