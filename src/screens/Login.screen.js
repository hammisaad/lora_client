import React from "react";
import { useHistory } from "react-router-dom";

import { sendMessage } from "../actions";

function LoginScreen({
  setUser,
  setLogged,
  socket,
  user,
  messages,
  setMessagesRef,
}) {
  const history = useHistory();
  const [username, setUsername] = React.useState("");
  const [userID, setUserID] = React.useState("");

  // handling login
  const handleUser = (data) => {
    if (/\s/.test(data.name)) {
      // It has any kind of whitespace
      alert("your username should not contain spaces");
      return;
    }
    if (data.name.length > 5) {
      // too long
      alert("your username should be 5 characters max");
      return;
    }
    sendMessage(
      socket.current,
      user,
      messages,
      setMessagesRef,
      data.name + " " + data.id + "*0~general|",
      (err) => {
        console.log(err);
      }
    );
    setUser(data);
    setLogged(true);
    history.push("general");
  };

  return (
    <div className="join-container">
      <div className="join-header">welcome to lora client</div>
      <form
        className="join-main"
        onSubmit={(e) => {
          e.preventDefault();
          handleUser({ name: username, id: userID });
        }}
      >
        <input
          placeholder="name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          className="name-field"
        />
        <input
          placeholder="id"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          type="number"
          min={0}
          max={100}
          className="id-field"
        />
        <button
          className="btn"
          onClick={() => handleUser({ name: username, id: userID })}
        >
          enter chat
        </button>
      </form>
    </div>
  );
}

export default LoginScreen;
