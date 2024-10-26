// src/components/notifications/utils.js
import { Bell, AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const getNotificationTypeStyles = (type) => {
  const styles = {
    [NotificationTypes.SUCCESS]: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    },
    [NotificationTypes.ERROR]: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    [NotificationTypes.WARNING]: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    [NotificationTypes.INFO]: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  return styles[type] || styles[NotificationTypes.INFO];
};

export const getNotificationIcon = (type) => {
  const icons = {
    [NotificationTypes.SUCCESS]: <CheckCircle className="w-5 h-5 text-green-500" />,
    [NotificationTypes.ERROR]: <X className="w-5 h-5 text-red-500" />,
    [NotificationTypes.WARNING]: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    [NotificationTypes.INFO]: <Info className="w-5 h-5 text-blue-500" />
  };

  return icons[type] || <Bell className="w-5 h-5 text-gray-500" />;
};