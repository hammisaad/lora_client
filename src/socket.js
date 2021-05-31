import arrayBufferToBuffer from "arraybuffer-to-buffer/arraybuffer-to-buffer";

let listeners = [];
let sentCallbacks = {};
let curId = 0;

function generateID() {
  let b = Buffer.alloc(2);
  b.writeUInt16LE(curId);

  if (curId >= Math.pow(2, 16) - 1) {
    curId = 0;
  } else {
    curId++;
  }

  return b;
}

function toHex(b) {
  let s = "";
  let i;
  for (i = 0; i < b.length; i++) {
    s += b[i] <= 16 ? "0" + b[i].toString(16) : b[i].toString(16);
  }
  return s;
}

// route incoming messages to the correct listeners
export function gotMessage(event) {
  if (!event.data) {
    console.warn("Received message with no data");
    return;
  }

  let data = arrayBufferToBuffer(event.data);

  // is the message shorter than the message ID?
  if (data.length <= 2) {
    console.warn("Received invalid message (too short)");
    return;
  }

  let id = data.slice(0, 2);
  data = data.slice(2);

  console.log("[websocket rx]", toHex(id), data.toString("utf8"));

  // is this an ACK?
  if (data.slice(0, 1).toString("utf8") === "!" && data.length === 1) {
    let sentCb = sentCallbacks[id];
    if (!sentCb) {
      console.warn("Got ACK for unknown message ID: " + id);
      return;
    }

    clearTimeout(sentCb.timeout);

    delete sentCallbacks[id];
    return;
  }

  let i, l, namespace, split;
  for (i = 0; i < listeners.length; i++) {
    l = listeners[i];
    if (data.indexOf(l.namespace) !== 0) continue;
    if (!(split = data.indexOf("|"))) {
      console.error("invalid message received: no namespace");
      continue;
    }
    if (data.length < split + 2) {
      console.error("invalid message received: empty message");
      continue;
    }

    namespace = data.slice(0, split);
    data = data.slice(split + 1);
    l.callback(namespace, data);
  }
}

export function sendFinal(socket, namespace, msg, cb) {
  let msgID = generateID();

  msg = Buffer.concat([msgID, Buffer.from(namespace + "|" + msg, "utf8")]);
  socket.send(msg);

  sentCallbacks[msgID] = {
    callback: cb,
    timeout: setTimeout(function () {
      if (!sentCallbacks[msgID]) return;

      console.log("Timed out while waiting for ack");
    }, 5000),
  };
}

export function addListener(namespace, cb) {
  if (!Buffer.isBuffer(namespace)) {
    namespace = Buffer.from(namespace, "utf8");
  }

  listeners.push({
    namespace: namespace,
    callback: cb,
  });
}
