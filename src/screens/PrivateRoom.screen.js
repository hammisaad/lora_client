import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { sendMessage } from "../actions";

import ChatMessage from "../components/ChatMessage.component";

function PrivateRoomScreen({
  socket,
  user,
  messages,
  messagesRef,
  setMessagesRef,
  clearUser,
}) {
  let { id } = useParams();
  const [messageField, setMessageField] = React.useState("");

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
      id + "~private|" + msg,
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
        <h4 className="chat-header">Private with {id}</h4>
        <Link className="btn" to="/general">
          go to general
        </Link>
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
            .filter(
              (msg) =>
                (msg.senderName === id && msg.receiverName === user.name) ||
                (msg.senderName === user.name && msg.receiverName === id)
            )
            .map((msg, i) => (
              <ChatMessage key={msg.msg + i} msg={msg} myName={user.name} />
            ))}
        </div>
        <div className="chat-form-container">
          {" "}
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

export default PrivateRoomScreen;
