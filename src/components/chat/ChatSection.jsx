import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSend, FiChevronLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ChatSection.css';

const ChatSection = ({ userRole }) => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const location = useLocation();

    const fetchChats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://team-2-m0tb.onrender.com/api/chats', {
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

    useEffect(() => {
        fetchChats();
    }, [location.hash]); // Refetch if hash changes to get latest active chat

    useEffect(() => {
        if (chats.length > 0) {
            const hash = location.hash;
            if (hash.includes('?jobId=')) {
                const jobId = hash.split('?jobId=')[1];
                const targetChat = chats.find(c => c.jobId && (c.jobId._id === jobId || c.jobId === jobId));
                if (targetChat) {
                    setActiveChat(targetChat);
                }
            }
        }
    }, [chats, location.hash]);

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
            const res = await fetch(`https://team-2-m0tb.onrender.com/api/chats/${activeChat._id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ message: messageInput })
            });

            if (res.ok) {
                const updatedChat = await res.json();
                setActiveChat(updatedChat);
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
        window.history.pushState("", document.title, window.location.pathname + "#chats");
        fetchChats();
    };

    return (
        <div className="chat-section-container glass-card">
            {!activeChat ? (
                <div className="chat-section-inbox">
                    <div className="chat-section-header">
                        <h2 className="dashboard-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Messages</h2>
                        <p className="dashboard-subtitle" style={{ marginBottom: 0 }}>
                            {userRole === 'student' ? 'Communicate with recruiters for your accepted applications.' : 'Communicate with your accepted applicants.'}
                        </p>
                    </div>
                    <div className="chat-section-list">
                        {loading ? (
                            <div className="chat-section-empty">Loading chats...</div>
                        ) : chats.length === 0 ? (
                            <div className="chat-section-empty">No chats available yet.</div>
                        ) : (
                            chats.map(chat => {
                                const otherUser = userRole === 'student' ? chat.jobId.companyName : chat.studentId.name;
                                const lastMessage = chat.messages[chat.messages.length - 1]?.message || '';
                                return (
                                    <div key={chat._id} className="chat-section-list-item" onClick={() => setActiveChat(chat)}>
                                        <div className="chat-section-avatar">
                                            {otherUser.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="chat-section-item-info">
                                            <div className="chat-section-item-top">
                                                <h4 className="chat-section-item-title">{otherUser}</h4>
                                                <span className="chat-section-item-job">{chat.jobId.title}</span>
                                            </div>
                                            <p className="chat-section-item-preview">{lastMessage}</p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            ) : (
                <div className="chat-section-thread">
                    <div className="chat-section-thread-header">
                        <button className="chat-section-back-btn" onClick={navigateToInbox}>
                            <FiChevronLeft size={24} />
                        </button>
                        <div className="chat-section-thread-title">
                            <h4>{userRole === 'student' ? activeChat.jobId.companyName : activeChat.studentId.name}</h4>
                            <span>{activeChat.jobId.title}</span>
                        </div>
                    </div>

                    <div className="chat-section-messages">
                        {activeChat.messages.map((msg, index) => {
                            const isMine = msg.senderRole === userRole;
                            return (
                                <div key={index} className={`chat-section-bubble-row ${isMine ? 'mine' : 'theirs'}`}>
                                    <div className="chat-section-bubble">
                                        {msg.message}
                                        <span className="chat-section-time">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-section-input-area" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder={userRole === 'student' && activeChat.messages.length === 0 ? "Waiting for the recruiter to send the first message..." : "Type a message..."}
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            disabled={userRole === 'student' && activeChat.messages.length === 0}
                        />
                        <button type="submit" disabled={(!messageInput.trim()) || (userRole === 'student' && activeChat.messages.length === 0)} className="chat-section-send-btn" style={{ background: '#FFD700', color: '#000', borderRadius: '50%', width: 45, height: 45, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 15, border: 'none', cursor: 'pointer', opacity: (userRole === 'student' && activeChat.messages.length === 0) ? 0.5 : 1 }}>
                            <FiSend size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatSection;
