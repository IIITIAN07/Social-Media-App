import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        recipientId: { type: String, required: true },
        senderId: { type: String, required: true },
        type: {
            type: String,
            enum: ['like', 'follow', 'message'],
            required: true
        },
        postId: String,
        conversationId: String,
        text: String,
        isRead: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const NotificationModel = mongoose.model("Notifications", notificationSchema);

export default NotificationModel;
