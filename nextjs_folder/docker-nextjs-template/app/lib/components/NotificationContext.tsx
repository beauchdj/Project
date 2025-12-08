/* Gavin Stankovsky
 *  November 2025
 *  Notification handling component
 */

"use client";

import { createContext, useContext, useRef, useState } from "react";

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
  const timeoutId = useRef<NodeJS.Timeout>(null);

  const toggleHidden = (str: string) => {
    setMessage(str);
    setIsHidden(false);
    if (timeoutId.current) clearTimeout(timeoutId.current);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    timeoutId.current = setTimeout(() => {
      setIsHidden(true);
      setMessage("");
    }, 3000);
  };

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
      className="w-45 h-20 bg-pink-800 text-white rounded-3xl absolute bottom-10 right-10 flex justify-center items-center text-center overflow-auto border-2 border-black z-4"
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
