import React from "react";
import { Link } from "react-router-dom";

export default function ChatMessage({
  myName,
  msg: { msg, senderName, type },
  ...props
}) {
  return (
    <div
      className={`message ${type === "status" && "message-status"} 
       ${type === "self" && "message-ours"}`}
      {...props}
    >
      {type === "status" && (
        <Link
          to={senderName !== myName ? `/private/${senderName}` : "#"}
          className="text status"
        >
          {senderName === myName ? "you" : senderName} {msg}
        </Link>
      )}
      {type !== "status" && (
        <p className={`text ${type === "self" ? "ours" : "theirs"}`}>{msg}</p>
      )}

      {type === "remote" && (
        <Link to={`/private/${senderName}`} className="meta">
          {senderName}
        </Link>
      )}
    </div>
  );
}
