import React from "react";

import { sendMessage } from "../actions";

import ChatMessage from "../components/ChatMessage.component";

function GeneralRoomScreen({
  socket,
  user,
  messages,
  messagesRef,
  setMessagesRef,
  clearUser,
}) {
  const [messageField, setMessageField] = React.useState("");

  // scroll on new message
  React.useEffect(() => {
    scrollBottom();
  }, [messagesRef.current]);

  // handling new message
  const handleMessage = (msg) => {
    if (!msg.trim().length) return;

    sendMessage(
      socket.current,
      user,
      messages,
      setMessagesRef,
      "0~general|" + msg,
      (err) => {
        console.log(err);
      }
    );
    setMessageField("");
    let msgInput = document.getElementById("msgInput");
    msgInput.focus();
  };

  const scrollBottom = () => {
    let chat = document.getElementById("chat");
    chat.scrollTop = chat.scrollHeight;
  };

  return (
    <>
      <button
        className="btn logout"
        onClick={() => {
          localStorage.removeItem("user");
          clearUser();
        }}
      >
        logout
      </button>
      <header className="chat-header">
        <h4 className="chat-header">General</h4>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleMessage(messageField);
        }}
        className="chat-form"
      >
        <div id="chat" className="chat-messages">
          {messages
            .filter((msg) => msg.receiverName === "0" || msg.type === "status")
            .map((msg, i) => (
              <ChatMessage key={msg.msg + i} msg={msg} myName={user.name} />
            ))}
        </div>
        <div className="chat-form-container">
          <input
            id="msgInput"
            placeholder="message"
            value={messageField}
            onChange={(e) => {
              setMessageField(e.target.value);
            }}
            type="text"
            className="chat-form-input"
          />
          <button className="btn" onClick={() => handleMessage(messageField)}>
            send
          </button>
        </div>
      </form>
    </>
  );
}

export default GeneralRoomScreen;
