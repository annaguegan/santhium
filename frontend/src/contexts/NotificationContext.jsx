import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import '../styles/Notifications.css';

const NotificationContext = createContext(null);

const generateNotificationId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = 'success') => {
      const id = generateNotificationId();
      setNotifications((prev) => [...prev, { id, message, type }]);

      const timeoutId = setTimeout(() => {
        removeNotification(id);
        timersRef.current = timersRef.current.filter((timer) => timer !== timeoutId);
      }, 3000);

      timersRef.current.push(timeoutId);
    },
    [removeNotification]
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="notification-container">
        {notifications.map(({ id, message, type }) => (
          <div key={id} className={`notification notification-${type}`}>
            {message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
