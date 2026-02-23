"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(
        ({ id, title, description, action, duration = 3000, ...props }) => (
          <ToastItem
            key={id}
            id={id}
            title={title}
            description={description}
            action={action}
            duration={duration}
            onDismiss={() => dismiss(id)}
            {...props}
          />
        ),
      )}
      <ToastViewport />
    </ToastProvider>
  );
}

function ToastItem({
  id,
  title,
  description,
  action,
  duration,
  onDismiss,
  ...props
}: {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  duration: number;
  onDismiss: () => void;
  [key: string]: unknown;
}) {
  useEffect(() => {
    // Auto-dismiss toast after duration
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <Toast {...props}>
      <div className="grid gap-1">
        {title ? <ToastTitle>{title}</ToastTitle> : null}
        {description ? (
          <ToastDescription>{description}</ToastDescription>
        ) : null}
      </div>
      {action}
      <ToastClose />
    </Toast>
  );
}
