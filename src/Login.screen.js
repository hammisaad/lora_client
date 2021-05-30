import React from "react";

import { useHistory } from "react-router-dom";

function LoginScreen({ setUser, setLogged }) {
  const history = useHistory();
  const [username, setUsername] = React.useState("");
  const [userID, setUserID] = React.useState("");

  // handling login
  const handleUser = (username) => {
    if (/\s/.test(username.name)) {
      // It has any kind of whitespace
      alert("your username should not contain spaces");
      return;
    }
    if (username.name.length >= 5) {
      // too long
      alert("your username should be 5 characters max");
      return;
    }
    setUser(username);
    setLogged(true);
    history.push("general");
  };

  return (
    <div className="join-container">
      <div className="join-header">welcome to lora client</div>
      <form
        className="join-main"
        onSubmit={() => handleUser({ name: username, id: userID })}
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
