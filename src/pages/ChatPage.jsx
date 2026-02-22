import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMoreVertical, FiSearch } from 'react-icons/fi';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import './Dashboard.css';
import './ChatPage.css';

const conversations = [
    { id: 1, company: 'Google', recruiter: 'Aditya K.', role: 'SWE', logo: 'G', color: '#4285F4', lastMsg: 'Looking forward to speaking with you!', time: '2m', unread: 2 },
    { id: 2, company: 'Razorpay', recruiter: 'Sonia M.', role: 'Frontend', logo: 'R', color: '#3395FF', lastMsg: 'Please confirm your availability.', time: '1h', unread: 0 },
    { id: 3, company: 'Microsoft', recruiter: 'James T.', role: 'UX Research', logo: 'M', color: '#00A4EF', lastMsg: 'Your profile looks great for this...', time: '2h', unread: 1 },
];

const initialMessages = [
    { id: 1, text: "Hi Vaishakh! I'm Aditya from Google's hiring team. We've reviewed your application and we're very impressed.", from: 'recruiter', time: '10:02 AM' },
    { id: 2, text: "We'd love to schedule a technical interview with you at your convenience. Are you available this week?", from: 'recruiter', time: '10:03 AM' },
    { id: 3, text: "Hi Aditya! Thank you so much. I'd be very excited to interview with Google. I'm available Wednesday or Thursday this week.", from: 'student', time: '10:31 AM' },
    { id: 4, text: "Great! Let's schedule Thursday at 2 PM IST. I'll send you a link and preparation guide shortly.", from: 'recruiter', time: '10:35 AM' },
    { id: 5, text: "Looking forward to speaking with you!", from: 'recruiter', time: '10:35 AM' },
];

const ChatPage = ({ role = 'student' }) => {
    const [activeConv, setActiveConv] = useState(conversations[0]);
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: input,
            from: 'student',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }]);
        setInput('');
    };

    return (
        <div className="dashboard-layout">
            <DashboardSidebar role={role} />
            <div className="dashboard-main" style={{ padding: 0 }}>
                <div className="chat-layout">
                    {/* Conversation List */}
                    <div className="chat-sidebar">
                        <div className="chat-sidebar-header">
                            <h3>Messages</h3>
                            <div className="chat-search">
                                <FiSearch size={14} />
                                <input type="text" placeholder="Search..." className="chat-search-input" />
                            </div>
                        </div>
                        <div className="conv-list">
                            {conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`conv-item ${activeConv.id === conv.id ? 'conv-item--active' : ''}`}
                                    onClick={() => setActiveConv(conv)}
                                >
                                    <div className="conv-logo" style={{ background: conv.color + '20', color: conv.color }}>
                                        {conv.logo}
                                    </div>
                                    <div className="conv-info">
                                        <div className="conv-top">
                                            <span className="conv-company">{conv.company}</span>
                                            <span className="conv-time">{conv.time}</span>
                                        </div>
                                        <div className="conv-recruiter">{conv.recruiter} · {conv.role}</div>
                                        <div className="conv-last">{conv.lastMsg}</div>
                                    </div>
                                    {conv.unread > 0 && (
                                        <div className="conv-unread">{conv.unread}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="chat-area">
                        {/* Chat Header */}
                        <div className="chat-area-header">
                            <div className="chat-contact">
                                <div className="conv-logo" style={{ background: activeConv.color + '20', color: activeConv.color }}>
                                    {activeConv.logo}
                                </div>
                                <div>
                                    <div className="chat-contact-name">{activeConv.recruiter}</div>
                                    <div className="chat-contact-sub">{activeConv.company} · {activeConv.role}</div>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm"><FiMoreVertical /></button>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {messages.map(msg => (
                                <div key={msg.id} className={`message ${msg.from === 'student' ? 'message--student' : 'message--recruiter'}`}>
                                    <div className="message-bubble">
                                        {msg.text}
                                        <span className="message-time">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <form className="chat-input-area" onSubmit={sendMessage}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="chat-input"
                            />
                            <button type="submit" className="chat-send-btn btn btn-gold">
                                <FiSend size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
