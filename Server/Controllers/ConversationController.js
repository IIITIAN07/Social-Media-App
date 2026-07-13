import ConversationModel from "../Models/conversationModel.js";
import UserModel from "../Models/userModel.js";

export const createConversation = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        let conversation = await ConversationModel.findOne({ members: { $all: [senderId, receiverId] } });

        if (!conversation) {
            conversation = await ConversationModel.create({ members: [senderId, receiverId] });
        }

        res.status(200).json(await populateConversation(conversation, senderId));
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getUserConversations = async (req, res) => {
    try {
        const conversations = await ConversationModel.find({ members: { $in: [req.params.userId] } }).sort({ updatedAt: -1 });
        const populatedConversations = await Promise.all(
            conversations.map((conversation) => populateConversation(conversation, req.params.userId))
        );

        res.status(200).json(populatedConversations);
    } catch (error) {
        res.status(500).json(error);
    }
};

const populateConversation = async (conversation, currentUserId) => {
    const otherUserId = conversation.members.find((memberId) => memberId !== currentUserId);
    const user = await UserModel.findById(otherUserId).select('firstname lastname profilePicture');

    return {
        ...conversation.toObject(),
        user
    };
};
