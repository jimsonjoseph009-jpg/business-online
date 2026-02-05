import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import Pagination from './Pagination';
import { messageAPI } from '../utils/apiClient';
import { auth } from '../config/firebase';
import { getIdToken } from 'firebase/auth';
import './Messages.css';

const Messages = () => {
  const { t } = useLocalization();
  const [messages, setMessages] = useState(mockMessageData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [formData, setFormData] = useState({
    from: '',
    subject: '',
    message: '',
    status: 'open'
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await getIdToken(user);
          const response = await fetch('/api/messages', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const data = await response.json();
            setMessages(data || mockMessageData);
          } else {
            setMessages(mockMessageData);
          }
        } else {
          setMessages(mockMessageData);
        }
      } catch (apiError) {
        console.log('Using mock data - API not available');
        setMessages(mockMessageData);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await getIdToken(user);
        await fetch(`/api/messages/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'resolved' })
        });
      }
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'resolved' } : m));
    } catch (error) {
      console.error('Error resolving message:', error);
    }
  };

  const handleEdit = (message) => {
    setEditingMessage(message);
    setFormData({
      from: message.from || '',
      subject: message.subject || '',
      message: message.message || '',
      status: message.status || 'open'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      const user = auth.currentUser;
      if (user) {
        const token = await getIdToken(user);
        const response = await fetch(`/api/messages/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          setMessages(messages.filter(m => m.id !== id));
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);

      if (editingMessage) {
        const response = await fetch(`/api/messages/${editingMessage.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setMessages(messages.map(m => 
            m.id === editingMessage.id ? { ...m, ...formData } : m
          ));
        }
      } else {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newMessage = await response.json();
          setMessages([newMessage, ...messages]);
        }
      }

      setShowModal(false);
      setEditingMessage(null);
      setFormData({ from: '', subject: '', message: '', status: 'open' });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const { items: paginatedMessages, totalPages } = (() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      items: messages.slice(startIndex, endIndex),
      totalPages: Math.ceil(messages.length / pageSize)
    };
  })();

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="messages">
      <div className="page-header">
        <h1>💬 Messages & Support</h1>
        <p>Customer messages and support tickets</p>
        <button 
          className="add-button"
          onClick={() => {
            setEditingMessage(null);
            setFormData({ from: '', subject: '', message: '', status: 'open' });
            setShowModal(true);
          }}
        >
          + New Message
        </button>
      </div>

      <div className="messages-stats">
        <div className="stat-card">
          <span className="stat-label">Total Messages</span>
          <span className="stat-value">{messages.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Unread</span>
          <span className="stat-value warning">{messages.filter(m => !m.read).length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Open Tickets</span>
          <span className="stat-value">{messages.filter(m => m.status === 'open').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Resolved</span>
          <span className="stat-value">{messages.filter(m => m.status === 'resolved').length}</span>
        </div>
      </div>

      <div className="messages-table-container">
        <table className="messages-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMessages.map(message => (
              <tr key={message.id} className={message.read ? '' : 'unread'}>
                <td className="from">{message.from}</td>
                <td>{message.subject}</td>
                <td className="preview">{message.message.substring(0, 50)}...</td>
                <td>
                  <span className={`status-badge status-${message.status}`}>
                    {message.status}
                  </span>
                </td>
                <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                <td className="action-cell">
                  {message.status === 'open' && (
                    <button className="btn-resolve" onClick={() => handleResolve(message.id)}>Resolve</button>
                  )}
                  <button className="btn-edit" onClick={() => handleEdit(message)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(message.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={messages.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingMessage ? 'Edit Message' : 'New Message'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>From</label>
                <input
                  type="email"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="open">Open</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const mockMessageData = [
  { id: '1', from: 'john@example.com', subject: 'Order issue', message: 'I received my order but it seems to have some defects...', status: 'open', read: false, createdAt: new Date() },
  { id: '2', from: 'jane@example.com', subject: 'Shipping delay', message: 'When will my order arrive? It was supposed to come yesterday.', status: 'resolved', read: true, createdAt: new Date() },
  { id: '3', from: 'bob@example.com', subject: 'Payment question', message: 'Do you accept cryptocurrency payments?', status: 'open', read: false, createdAt: new Date() },
];

export default Messages;
