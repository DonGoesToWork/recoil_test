import React, { useEffect, useState } from 'react';
import './Toast.css'; // Importing the CSS

interface ToastProps {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  if (!visible) return null;

  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
