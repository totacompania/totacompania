'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Trash2, Eye } from 'lucide-react';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      });
      fetchMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      setSelected(null);
      fetchMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openMessage = (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      markAsRead(msg._id);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">
          {unreadCount > 0 ? `${unreadCount} message(s) non lu(s)` : 'Tous les messages ont ete lus'}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="bg-white rounded-xl shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Chargement...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              Aucun message
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => openMessage(msg)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selected?._id === msg._id ? 'bg-primary/5' : 'hover:bg-gray-50'
                  } ${!msg.read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${msg.read ? 'bg-gray-100' : 'bg-primary/10'}`}>
                      {msg.read ? (
                        <MailOpen className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Mail className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`truncate ${!msg.read ? 'font-semibold' : ''} text-gray-900`}>
                          {msg.name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{msg.subject || 'Sans objet'}</p>
                      <p className="text-xs text-gray-400 truncate mt-1">{msg.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-white rounded-xl shadow-sm">
          {selected ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selected.subject || 'Sans objet'}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    De: {selected.name} &lt;{selected.email}&gt;
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(selected.createdAt)}</p>
                </div>
                <button
                  onClick={() => deleteMessage(selected._id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <hr className="my-4" />
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{selected.message}</p>
              </div>
              <hr className="my-4" />
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Mail className="w-4 h-4" />
                Repondre
              </a>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              Selectionnez un message pour le lire
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
