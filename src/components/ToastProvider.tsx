"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      theme="dark"
      closeButton
      toastOptions={{
        classNames: {
          toast: "app-toast",
          title: "app-toast-title",
          description: "app-toast-description",
          closeButton: "app-toast-close",
        },
      }}
    />
  );
}
