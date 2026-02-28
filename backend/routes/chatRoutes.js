import express from 'express';
import { getChats, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // Ensure all chat routes require authentication

router.route('/')
    .get(getChats);

router.route('/:chatId/messages')
    .post(sendMessage);

export default router;
