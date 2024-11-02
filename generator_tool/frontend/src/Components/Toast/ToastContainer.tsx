import "./Toast.css";

import React, { ReactNode, createContext, useContext, useState } from "react";

import Toast from "./Toast";

// Define the ToastContext
interface ToastContextProps {
  addToast: (message: string, type: "success" | "error" | "info", duration: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Hook to use the Toast context
export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
}

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info", duration: number) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} id={toast.id} message={toast.message} type={toast.type} duration={toast.duration} onClose={removeToast} />
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
};
