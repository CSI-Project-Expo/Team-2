import Chat from '../models/Chat.js';

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role; // Assuming `req.user` populates the user role

        let query = {};
        if (role === 'student') {
            query.studentId = userId;
        } else if (role === 'recruiter') {
            query.recruiterId = userId;
        }

        const chats = await Chat.find(query)
            .populate('studentId', 'name email')
            .populate('recruiterId', 'name email')
            .populate('jobId', 'title companyName')
            .sort({ updatedAt: -1 });

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a new message to an existing chat
// @route   POST /api/chats/:chatId/messages
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const chatId = req.params.chatId;

        if (!message) {
            return res.status(400).json({ message: 'Message text is required' });
        }

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const senderId = req.user._id;
        const senderRole = req.user.role;

        // Verify the user is part of the chat
        if (senderRole === 'student' && chat.studentId.toString() !== senderId.toString()) {
            return res.status(401).json({ message: 'Not authorized for this chat' });
        }
        if (senderRole === 'recruiter' && chat.recruiterId.toString() !== senderId.toString()) {
            return res.status(401).json({ message: 'Not authorized for this chat' });
        }

        // Students can only reply if there is at least one message (from the recruiter)
        if (senderRole === 'student' && chat.messages.length === 0) {
            return res.status(403).json({ message: 'Recruiter must send the first message' });
        }

        const newMessage = {
            senderId,
            senderRole,
            message,
            timestamp: new Date()
        };

        chat.messages.push(newMessage);
        await chat.save();

        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
