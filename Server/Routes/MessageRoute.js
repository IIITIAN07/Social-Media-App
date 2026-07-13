import express from "express";
import { createMessage, getMessages, markMessagesAsRead } from "../Controllers/MessageController.js";

const router = express.Router();

router.post('/', createMessage);
router.get('/:conversationId', getMessages);
router.put('/:conversationId/read', markMessagesAsRead);

export default router;
