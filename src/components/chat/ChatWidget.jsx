import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiX, FiSend, FiChevronLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './ChatWidget.css';

const ChatWidget = ({ userRole }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    const fetchChats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/chats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setChats(data);
            } else {
                console.error("Failed to fetch chats");
            }
        } catch (err) {
            console.error("Chat fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch list on open
    useEffect(() => {
        if (isOpen && !activeChat) {
            fetchChats();
        }
    }, [isOpen, activeChat]);

    // Scroll bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (activeChat) {
            scrollToBottom();
        }
    }, [activeChat?.messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeChat) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/chats/${activeChat._id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ message: messageInput })
            });

            if (res.ok) {
                const updatedChat = await res.json();

                // Update the active chat object with the new message list
                setActiveChat(updatedChat);

                // Update the general chats list as well so the preview updates
                setChats(prev => prev.map(c => c._id === updatedChat._id ? updatedChat : c));

                setMessageInput('');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error(error);
            toast.error('Network error while sending message');
        }
    };

    const navigateToInbox = () => {
        setActiveChat(null);
        fetchChats(); // Refresh on back
    };

    return (
        <div className="chat-widget-container">
            {/* The Floating Bubble */}
            <motion.button
                className="chat-fab"
                onClick={toggleOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
            </motion.button>

            {/* The Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chat-panel"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* INBOX VIEW */}
                        {!activeChat ? (
                            <div className="chat-inbox">
                                <div className="chat-header">
                                    <h3>Inbox</h3>
                                </div>
                                <div className="chat-list">
                                    {loading ? (
                                        <div className="chat-empty">Loading chats...</div>
                                    ) : chats.length === 0 ? (
                                        <div className="chat-empty">No chats available yet.</div>
                                    ) : (
                                        chats.map(chat => {
                                            const otherUser = userRole === 'student' ? chat.jobId.companyName : chat.studentId.name;
                                            const lastMessage = chat.messages[chat.messages.length - 1]?.message || '';
                                            return (
                                                <div key={chat._id} className="chat-list-item" onClick={() => setActiveChat(chat)}>
                                                    <div className="chat-item-avatar">
                                                        {otherUser.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="chat-item-info">
                                                        <h4 className="chat-item-title">{otherUser}</h4>
                                                        <span className="chat-item-job">{chat.jobId.title}</span>
                                                        <p className="chat-item-preview">{lastMessage}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* THREAD VIEW */
                            <div className="chat-thread">
                                <div className="chat-header">
                                    <button className="chat-back-btn" onClick={navigateToInbox}>
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <div className="chat-thread-title">
                                        <h4>{userRole === 'student' ? activeChat.jobId.companyName : activeChat.studentId.name}</h4>
                                        <span>{activeChat.jobId.title}</span>
                                    </div>
                                </div>

                                <div className="chat-messages">
                                    {activeChat.messages.map((msg, index) => {
                                        const isMine = msg.senderRole === userRole;
                                        return (
                                            <div key={index} className={`chat-bubble-row ${isMine ? 'mine' : 'theirs'}`}>
                                                <div className="chat-bubble">
                                                    {msg.message}
                                                    <span className="chat-time">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form className="chat-input-area" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                    />
                                    <button type="submit" disabled={!messageInput.trim()}>
                                        <FiSend size={18} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatWidget;
