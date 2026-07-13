import NotificationModel from "../Models/notificationModel.js";
import UserModel from "../Models/userModel.js";
import { emitToUser } from "../Socket/socket.js";

export const createNotification = async ({ recipientId, senderId, type, postId, conversationId, text }) => {
    if (!recipientId || !senderId || recipientId.toString() === senderId.toString()) {
        return null;
    }

    const notification = await NotificationModel.create({
        recipientId,
        senderId,
        type,
        postId,
        conversationId,
        text
    });

    const populatedNotification = await populateNotification(notification);
    emitToUser(recipientId, 'newNotification', populatedNotification);

    return populatedNotification;
};

export const getNotifications = async (req, res) => {
    try {
        const notifications = await NotificationModel.find({ recipientId: req.params.userId }).sort({ createdAt: -1 });
        const populatedNotifications = await Promise.all(notifications.map(populateNotification));
        res.status(200).json(populatedNotifications);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await NotificationModel.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const markAllNotificationsAsRead = async (req, res) => {
    try {
        await NotificationModel.updateMany({ recipientId: req.params.userId }, { isRead: true });
        res.status(200).json("Notifications marked as read.");
    } catch (error) {
        res.status(500).json(error);
    }
};

const populateNotification = async (notification) => {
    const sender = await UserModel.findById(notification.senderId).select('firstname lastname profilePicture');
    return {
        ...notification.toObject(),
        sender
    };
};
