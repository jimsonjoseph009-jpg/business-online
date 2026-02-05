import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { auth } from '../config/firebase';
import './LiveChat.css';

const LiveChat = () => {
  const { t } = useLocalization();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [newConversation, setNewConversation] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isOnline] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch(`/api/messages/${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.id);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage = {
      conversationId: selectedChat.id,
      sender: 'support',
      text: messageInput,
      timestamp: new Date().toISOString(),
      read: false
    };

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      });

      setMessages([...messages, newMessage]);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStartConversation = async () => {
    if (!customerName.trim() || !customerEmail.trim()) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          status: 'active',
          createdAt: new Date().toISOString()
        })
      });

      const newChat = await response.json();
      setConversations([...conversations, newChat]);
      setSelectedChat(newChat);
      setNewConversation(false);
      setCustomerName('');
      setCustomerEmail('');
      setMessages([]);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleCloseChat = async () => {
    if (!selectedChat) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      await fetch(`/api/conversations/${selectedChat.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'closed' })
      });

      setConversations(conversations.filter(c => c.id !== selectedChat.id));
      setSelectedChat(null);
      setMessages([]);
    } catch (error) {
      console.error('Error closing chat:', error);
    }
  };

  return (
    <div className="live-chat">
      <div className="chat-header">
        <h1 className="chat-title">
          💬 {t('liveChat', 'title') || 'Live Chat Support'}
        </h1>
        <div className="status-indicator">
          <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
          <span className="status-text">
            {isOnline ? t('liveChat', 'online') : t('liveChat', 'offline') || 'Online'}
          </span>
        </div>
      </div>

      <div className="chat-container">
        {/* Conversations List */}
        <div className="conversations-panel">
          <div className="conversations-header">
            <h2>{t('liveChat', 'conversations') || 'Conversations'}</h2>
            <button
              className="btn-new-chat"
              onClick={() => setNewConversation(!newConversation)}
              title={t('liveChat', 'newChat') || 'New Chat'}
            >
              ➕
            </button>
          </div>

          {newConversation && (
            <div className="new-conversation-form">
              <input
                type="text"
                placeholder={t('liveChat', 'customerName') || 'Customer Name'}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="form-input"
              />
              <input
                type="email"
                placeholder={t('liveChat', 'customerEmail') || 'Email'}
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="form-input"
              />
              <button
                className="btn-start-chat"
                onClick={handleStartConversation}
              >
                {t('liveChat', 'startChat') || 'Start Chat'}
              </button>
            </div>
          )}

          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="empty-state">
                <p>{t('liveChat', 'noConversations') || 'No conversations'}</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`conversation-item ${selectedChat?.id === conv.id ? 'active' : ''}`}
                  onClick={() => handleSelectChat(conv)}
                >
                  <div className="conv-avatar">
                    👤
                  </div>
                  <div className="conv-info">
                    <div className="conv-name">{conv.customerName}</div>
                    <div className="conv-preview">
                      {conv.lastMessage || t('liveChat', 'noMessages') || 'No messages'}
                    </div>
                  </div>
                  <div className={`conv-status ${conv.status}`}>
                    {conv.status === 'active' && '🟢'}
                    {conv.status === 'waiting' && '🟡'}
                    {conv.status === 'closed' && '🔴'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedChat ? (
            <>
              <div className="chat-header-info">
                <div className="chat-customer-info">
                  <h3>{selectedChat.customerName}</h3>
                  <p>{selectedChat.customerEmail}</p>
                </div>
                <button
                  className="btn-close-chat"
                  onClick={handleCloseChat}
                  title={t('liveChat', 'closeChat') || 'Close Chat'}
                >
                  ✕
                </button>
              </div>

              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="empty-messages">
                    <p>{t('liveChat', 'noMessagesYet') || 'Start the conversation'}</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.sender === 'support' ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p className="message-text">{msg.text}</p>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input-area">
                <input
                  type="text"
                  className="message-input"
                  placeholder={t('liveChat', 'typeMessage') || 'Type a message...'}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  className="btn-send"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  {t('liveChat', 'send') || 'Send'}
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="empty-state-large">
                <p className="emoji">💬</p>
                <h3>{t('liveChat', 'selectChat') || 'Select a conversation'}</h3>
                <p>{t('liveChat', 'selectChatDesc') || 'Choose a conversation from the list to start chatting'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
