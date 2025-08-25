import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export const useTestSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
};