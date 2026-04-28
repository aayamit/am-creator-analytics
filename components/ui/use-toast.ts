import { useState, useCallback } from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

type Toast = ToastProps & {
  id: string;
};

let toasts: Toast[] = [];
let listeners: (() => void)[] = [];

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function toast(props: ToastProps) {
  const id = Math.random().toString(36).substring(2, 9);
  toasts = [...toasts, { ...props, id }];
  emitChange();

  // Auto remove after 3 seconds
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emitChange();
  }, 3000);
}

export function useToast() {
  const [_, forceUpdate] = useState(0);

  const addToast = useCallback((props: ToastProps) => {
    toast(props);
  }, []);

  return { toast: addToast };
}
