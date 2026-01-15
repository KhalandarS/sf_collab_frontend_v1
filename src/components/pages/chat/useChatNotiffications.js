import { useContext } from "react";

e/*xport default function useChatNotifications({ ChatNotificationContext}) {

  const context = useContext(ChatNotificationContext);
  if (!context) {
    throw new Error('useChatNotifications must be used within ChatNotificationProvider');
  }
  return context;
};*/

// useChatNotifications.js
// Use the hook exported from ChatNotificationProvider instead

// Re-export from the provider for backwards compatibility
export { useChatNotifications as default } from "@/components/pages/chat/Chatnotificationprovider";