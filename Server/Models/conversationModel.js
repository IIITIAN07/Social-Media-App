import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
    {
        members: { type: [String], required: true },
        lastMessage: String
    },
    { timestamps: true }
);

const ConversationModel = mongoose.model("Conversations", conversationSchema);

export default ConversationModel;
