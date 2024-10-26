import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

const NotificationIcons = {
  [NotificationTypes.SUCCESS]: <CheckCircle className="w-6 h-6 text-green-500" />,
  [NotificationTypes.ERROR]: <XCircle className="w-6 h-6 text-red-500" />,
  [NotificationTypes.WARNING]: <AlertCircle className="w-6 h-6 text-yellow-500" />,
  [NotificationTypes.INFO]: <Info className="w-6 h-6 text-blue-500" />
};

const NotificationStyles = {
  [NotificationTypes.SUCCESS]: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800'
  },
  [NotificationTypes.ERROR]: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800'
  },
  [NotificationTypes.WARNING]: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800'
  },
  [NotificationTypes.INFO]: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800'
  }
};

const Notification = ({ 
  type = NotificationTypes.INFO,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = NotificationStyles[type];

  return (
    <div className={`fixed top-4 right-4 w-96 ${styles.bg} border ${styles.border} rounded-lg shadow-lg z-50`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {NotificationIcons[type]}
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className={`text-sm font-medium ${styles.text}`}>
                {title}
              </p>
            )}
            {message && (
              <p className={`mt-1 text-sm ${styles.text}`}>
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`bg-transparent rounded-md inline-flex ${styles.text} hover:text-gray-500 focus:outline-none`}
              onClick={() => {
                setIsVisible(false);
                onClose?.();
              }}
            >
              <span className="sr-only">Close</span>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
export { NotificationTypes };