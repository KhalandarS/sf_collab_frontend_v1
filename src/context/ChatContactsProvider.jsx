import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ChatContactsContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export function ChatContactsProvider({ token, children }) {
  const [friends, setFriends] = useState([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  const currentUserId = useMemo(() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null")?.id ?? null;
  } catch {
    return null;
  }
}, []);


  const fetchFriends = useCallback(async () => {
    if (!token) return;

    setIsLoadingFriends(true);
    try {
      // 1) try friends endpoint
      let response = await fetch(`${API_BASE_URL}/friend-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = await response.json();

      if (data?.success && data?.data?.friends) {
        setFriends(data.data.friends);
        return;
      }

      // 2) fallback to users
      response = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      data = await response.json();

      if (data?.success && data?.data?.users) {
        const users = data.data.users.filter((u) => u.id !== currentUserId);
        setFriends(users);
      }
    } catch (e) {
      console.error("Failed to fetch friends:", e);
    } finally {
      setIsLoadingFriends(false);
    }
  }, [token, currentUserId]);

  useEffect(() => {
    if (token) fetchFriends();
  }, [token, fetchFriends]);

  const value = useMemo(
    () => ({ friends, isLoadingFriends, refetchFriends: fetchFriends }),
    [friends, isLoadingFriends, fetchFriends]
  );

  return <ChatContactsContext.Provider value={value}>{children}</ChatContactsContext.Provider>;
}

export function useChatContacts() {
  const ctx = useContext(ChatContactsContext);
  if (!ctx) throw new Error("useChatContacts must be used within ChatContactsProvider");
  return ctx;
}
