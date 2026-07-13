import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        conversationId: { type: String, required: true },
        senderId: { type: String, required: true },
        text: { type: String, required: true },
        isRead: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const MessageModel = mongoose.model("Messages", messageSchema);

export default MessageModel;
