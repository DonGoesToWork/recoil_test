import "./Toast.css";

import React, { ReactNode, createContext, useContext, useState } from "react";

import Toast from "./Toast";

// Define the ToastContext
interface Toast_Context_Props {
  add_toast: (message: string, type: "success" | "error" | "info", duration: number) => void;
}

const Toast_Context = createContext<Toast_Context_Props | undefined>(undefined);

// Hook to use the Toast context
export const useToast = (): Toast_Context_Props => {
  const context = useContext(Toast_Context);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface Toast_Item {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
}

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, set_toasts] = useState<Toast_Item[]>([]);

  const add_toast = (message: string, type: "success" | "error" | "info", duration: number) => {
    const id = Date.now();
    set_toasts((prev_toasts) => [...prev_toasts, { id, message, type, duration }]);
  };

  const remove_toast = (id: number) => {
    set_toasts((prev_toasts) => prev_toasts.filter((toast) => toast.id !== id));
  };

  return (
    <Toast_Context.Provider value={{ add_toast: add_toast }}>
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} id={toast.id} message={toast.message} type={toast.type} duration={toast.duration} onClose={remove_toast} />
        ))}
      </div>
      {children}
    </Toast_Context.Provider>
  );
};
