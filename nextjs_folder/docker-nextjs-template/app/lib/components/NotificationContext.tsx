"use client";

import { createContext, useContext, useState } from "react";

interface NotificationContextType {
  toggleHidden: (str: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  const toggleHidden = (str: string) => {
    setMessage(str);
    setIsHidden(false);
    setTimeout(() => {
      setIsHidden(true);
      setMessage("");
    }, 4000);
  };

  // const updateMessage = (str: string) => {
  //   setMessage(str);
  // };

  return (
    <NotificationContext.Provider value={{ toggleHidden }}>
      <Notification message={message} isHidden={isHidden} />
      {children}
    </NotificationContext.Provider>
  );
}

function Notification({
  message,
  isHidden,
}: {
  message: string;
  isHidden: boolean;
}) {
  return (
    <div
      className="w-45 h-20 bg-pink-800 text-white rounded-3xl absolute bottom-10 right-10 flex justify-center items-center text-center overflow-auto border-2 border-black"
      hidden={isHidden}
    >
      {message}
    </div>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used with a NotificationProvider");
  return ctx;
}
