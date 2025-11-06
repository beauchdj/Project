"use client";
import { FormEvent, useEffect, useState } from "react";
import { socket } from "../services/websocket";

export function WebSocketClient() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState<string[]>([]);
  const [send, setSend] = useState("");
  const [username, setUsername] = useState("");
  const [notify, setNotify] = useState(false);
  const [hasUsername, setHasUsername] = useState(false);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      console.log("Transport type: ", socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        // transport defines what type of protocol we are using to send messages, http polling or websockets
        // http polling is when a request is sent and held until a response is available, not blocking because other requests are unique messages
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      console.log("Disconnecting...");
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // socket.on("message", (resp) => {
    //   console.log("HIT MESSAGE: ", resp);
    // });

    socket.on("response", (resp) => {
      console.log("response: ", resp);
      setMessages((prev) => [...prev, resp]);
    });

    socket.on("notify", (response) => {
      console.log("test now pls: ", response);
      setNotify((prev) => !prev);
      console.log("SetNotify: ", notify);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  function handleMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = new FormData(e.currentTarget);
    const message = res.get("message");

    socket.emit("chat message", message);
    setSend(""); // reset input
  }
  function handleUsername(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = new FormData(e.currentTarget);
    const username = res.get("username") as string;

    socket.emit("set username", username);
    setUsername(username);
    setHasUsername(true);
  }

  return (
    <div className="flex justify-center items-center flex-col text-white">
      <div
        className="bg-blue-400 h-18 w-18 flex items-center justify-center "
        hidden={notify}
      >
        Follow!
      </div>
      <p>status: {isConnected ? "connected" : "disconnected"}</p>
      <p>transport: {transport} </p>
      <div className="bg-orange-300 h-100 w-100 p-4 rounded">
        <div className="bg-pink-100 h-60 w-92 rounded p-1 text-black font-bold overflow-auto">
          {messages.map((str, idx) => (
            <div key={idx}>{str}</div>
          ))}
        </div>
        <form onSubmit={handleMessage}>
          <label className="text-black flex flex-col">
            Send a message:
            <input
              type="text"
              name="message"
              value={send || ""}
              onChange={(e) => setSend(e.target.value)}
              placeholder="Send a message"
              className="bg-gray-300 rounded text-black border-black border indent-1 mt-1"
            ></input>
          </label>
        </form>
        <form onSubmit={handleUsername}>
          <label className={"text-black flex flex-col"}>
            Set a username:
            <input
              type="text"
              name="username"
              value={username || ""}
              placeholder="Set username"
              className="bg-gray-300 rounded text-black border-black border indent-1 mt-1"
              disabled={hasUsername}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
          </label>
        </form>
      </div>
    </div>
  );
}
