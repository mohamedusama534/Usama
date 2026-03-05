import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client';
import { Send, User, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

const Chat: React.FC = () => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    if (user) {
      newSocket.emit('join', user.userId);
    }

    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Mock contacts for demo - in real app, fetch from conversations table
    setContacts([
      { userId: 'system', name: 'WorkBridge Support', role: 'admin' },
    ]);
    setIsLoading(false);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !newMessage.trim() || !activeChat || !user) return;

    socket.emit('sendMessage', {
      senderId: user.userId,
      receiverId: activeChat,
      content: newMessage,
    });

    setNewMessage('');
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="h-[calc(100vh-12rem)] bg-white rounded-3xl border border-zinc-200 overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-zinc-200 flex flex-col">
        <div className="p-6 border-b border-zinc-200">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.userId}
              onClick={() => setActiveChat(contact.userId)}
              className={cn(
                "w-full p-4 flex items-center gap-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50",
                activeChat === contact.userId && "bg-indigo-50 border-indigo-100"
              )}
            >
              <div className="w-12 h-12 bg-zinc-200 rounded-2xl flex items-center justify-center text-zinc-500">
                <User className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-zinc-900 text-sm">{contact.name}</p>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{contact.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-50/50">
        {activeChat ? (
          <>
            <div className="p-4 bg-white border-b border-zinc-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-zinc-900 text-sm">
                  {contacts.find(c => c.userId === activeChat)?.name}
                </p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.filter(m => 
                (m.senderId === user?.userId && m.receiverId === activeChat) || 
                (m.senderId === activeChat && m.receiverId === user?.userId)
              ).map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "max-w-[70%] p-4 rounded-2xl text-sm font-medium",
                    msg.senderId === user?.userId
                      ? "bg-indigo-600 text-white ml-auto rounded-tr-none"
                      : "bg-white text-zinc-900 mr-auto rounded-tl-none border border-zinc-200"
                  )}
                >
                  {msg.content}
                  <p className={cn(
                    "text-[10px] mt-1 opacity-70",
                    msg.senderId === user?.userId ? "text-right" : "text-left"
                  )}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-zinc-200 flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <button
                type="submit"
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 space-y-4">
            <div className="w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center">
              <MessageSquare className="w-10 h-10" />
            </div>
            <p className="font-bold">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
