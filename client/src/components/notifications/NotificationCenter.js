// src/components/notifications/NotificationCenter.js
import React from 'react';
import { Bell } from 'lucide-react';

export const NotificationCenter = ({ notifications, onMarkAsRead }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm w-full">
    <div className="p-4 border-b">
      <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
    </div>
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  </div>
);

// src/components/notifications/NotificationItem.js - continuation
export const NotificationItem = ({ notification, onMarkAsRead }) => (
    <div 
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.isRead ? 'bg-indigo-50' : ''
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${getNotificationTypeStyles(notification.type).bgColor}`}>
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
          <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
        </div>
        {!notification.isRead && (
          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
        )}
      </div>
    </div>
  );
  
  // src/components/notifications/NotificationBadge.js
  export const NotificationBadge = ({ count }) => {
    if (!count) return null;
    
    return (
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
        {count > 99 ? '99+' : count}
      </div>
    );
  };
  
  // src/components/notifications/NotificationPreferences.js
  export const NotificationPreferences = ({ preferences, onUpdatePreferences }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(preferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={value}
                  onChange={() => onUpdatePreferences(key, !value)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };