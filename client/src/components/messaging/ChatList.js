// src/components/messaging/ChatList.js
import React from 'react';
import { Search } from 'lucide-react';

export const ChatList = ({ conversations, onSelect, selectedId }) => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation)}
          className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors ${
            selectedId === conversation.id ? 'bg-indigo-50' : ''
          }`}
        >
          {/* Add conversation content */}
        </button>
      ))}
    </div>
  </div>
);

// src/components/messaging/ChatWindow.js
export const ChatWindow = ({ conversation, messages, onSendMessage }) => (
  <div className="flex flex-col h-full">
    {/* Chat header */}
    <div className="flex items-center justify-between p-4 border-b">
      {/* Add header content */}
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Add messages */}
    </div>

    {/* Message input */}
    <div className="p-4 border-t">
      {/* Add message input */}
    </div>
  </div>
);

// src/components/messaging/MessageBubble.js
export const MessageBubble = ({ message, isSender }) => (
  <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
        isSender
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}
    >
      <p className="text-sm">{message.content}</p>
      <p className={`text-xs mt-1 ${
        isSender ? 'text-indigo-200' : 'text-gray-500'
      }`}>
        {message.timestamp}
      </p>
    </div>
  </div>
);