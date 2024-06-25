import React, { useEffect } from "react";
import { useAuth } from "authContext";

const WebSocketComponent = () => {
  const { dispatch } = useAuth();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const message = event.data;
      console.log("Received message: " + message);
      dispatch({ type: "UPDATE_STATUS", payload: message });
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.log("WebSocket error: ", error);
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  return null;
};

export default WebSocketComponent;
