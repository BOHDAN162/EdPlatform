import { useCallback, useState } from "react";

export const useToasts = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (text) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, text }]);
      setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  const addToasts = useCallback((messages) => messages.forEach((message) => addToast(message)), [addToast]);

  return { toasts, addToast, addToasts };
};
