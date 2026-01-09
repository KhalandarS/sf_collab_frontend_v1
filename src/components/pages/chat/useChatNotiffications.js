import { useContext } from "react";

export default function useChatNotifications({ ChatNotificationContext}) {

  const context = useContext(ChatNotificationContext);
  if (!context) {
    throw new Error('useChatNotifications must be used within ChatNotificationProvider');
  }
  return context;
};