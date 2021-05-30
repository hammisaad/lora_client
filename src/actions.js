import { sendFinal } from "./socket";

export function showMessage(messages, setMessages, msg, type) {
  if (!type) type = "remote";
  let senderName = msg.slice(0, msg.indexOf(" "));
  let senderID = msg.slice(msg.indexOf(" ") + 1, msg.indexOf("*"));
  let receiverName = msg.slice(msg.indexOf("*") + 1, msg.indexOf("~"));
  let receiverID = msg.slice(msg.indexOf("~") + 1, msg.indexOf("|"));
  msg = msg.slice(msg.indexOf("|") + 1);

  let msgs = [
    ...messages,
    { msg, type: type, senderName, senderID, receiverName, receiverID },
  ];
  setMessages(msgs);
}

export function sendMessage(socket, user, messages, setMessages, msg, cb) {
  if (!msg.trim())
    return cb(new Error("You must supply a (non-whitespace) message/nick"));

  let type = "self";
  if (!user.name.length) {
    msg = msg + " joined the channel";
    type = "status";
    sendFinal(socket, "+", msg, cb);
    showMessage(messages, setMessages, msg, type);
  } else {
    msg = user.name + " " + user.id + "*" + msg;
    sendFinal(socket, "c", msg, cb);
    showMessage(messages, setMessages, msg, type);
  }
}
