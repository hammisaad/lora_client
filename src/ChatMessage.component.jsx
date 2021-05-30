import React from "react";
import { Link } from "react-router-dom";

export default function ChatMessage({
  msg: { msg, senderName, type },
  ...props
}) {
  return (
    <div
      className={`message ${type === "status" && "message-status"} 
       ${type === "self" && "message-ours"}`}
      {...props}
    >
      <p
        className={`text ${type === "self" ? "ours" : "theirs"} ${
          type === "status" ? "status" : ""
        }`}
      >
        {msg}
      </p>
      {type === "remote" && (
        <Link to={`/private/${senderName}`} className="meta">
          {senderName}
        </Link>
      )}
    </div>
  );
}
