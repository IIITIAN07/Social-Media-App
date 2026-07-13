import ConversationModel from "../Models/conversationModel.js";
import MessageModel from "../Models/messageModel.js";
import { createNotification } from "./NotificationController.js";
import { emitToUser } from "../Socket/socket.js";

export const createMessage = async (req, res) => {
    const { conversationId, senderId, text } = req.body;

    try {
        const message = await MessageModel.create({ conversationId, senderId, text });
        const conversation = await ConversationModel.findByIdAndUpdate(
            conversationId,
            { lastMessage: text },
            { new: true }
        );

        const receiverId = conversation.members.find((memberId) => memberId !== senderId);

        emitToUser(receiverId, 'receiveMessage', message);
        await createNotification({
            recipientId: receiverId,
            senderId,
            type: 'message',
            conversationId,
            text: 'sent you a message'
        });

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getMessages = async (req, res) => {
    try {
        const messages = await MessageModel.find({ conversationId: req.params.conversationId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const markMessagesAsRead = async (req, res) => {
    try {
        await MessageModel.updateMany(
            { conversationId: req.params.conversationId, senderId: { $ne: req.body.userId } },
            { isRead: true }
        );
        res.status(200).json("Messages marked as read.");
    } catch (error) {
        res.status(500).json(error);
    }
};
