import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const chat_id = Date.now().toString();
    const socket = new WebSocket(`ws://localhost:8000/ws/${chat_id}`);

    socket.onopen = function () {
      console.log("[open] Connection established");
      console.log("Sending to server");
      socket.send("can you give me a reusable react input component?");
    };

    socket.onmessage = function (event) {
      console.log(`[message] Data received from server: ${event.data}`);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
      } else {
        console.log("[close] Connection died");
      }
    };

    socket.onerror = function (event: Event) {
      console.log(`[error] ${event.type}`);
    };
    // Clean up the connection when the component is unmounted
    return () => socket.close();
  }, []);

  return (
    <div className="App">
      <h1>Chat Window</h1>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
}

export default App;
