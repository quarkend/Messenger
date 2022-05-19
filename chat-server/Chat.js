const uuidv4 = require("uuid").v4;

const messages = new Set();
const users = new Map();

const defaultUser = {
  id: "anon",
  name: "Anonymous",
};
//  clientId: "00gWChJ2SCqhulk2qM6l8_n9_uqBNhDfAgu9GgvPN6",
//   issuer: "https://dev-05664828.okta.com/oauth2/default",

const messageExpirationTimeMS = 5 * 60 * 1000;
const OktaJwtVerifier = require("@okta/jwt-verifier");
const okta = require("@okta/okta-sdk-nodejs");

const jwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `https://dev-05664828.okta.com/oauth2/default/`,
});

const oktaClient = new okta.Client({
  orgUrl: "https://dev-05664828.okta.com",
  token: "00gWChJ2SCqhulk2qM6l8_n9_uqBNhDfAgu9GgvPN6",
});

async function authHandler(socket, next) {
  const { token = null } = socket.handshake.query || {};
  if (token) {
    try {
      const [authType, tokenValue] = token.trim().split(" ");
      if (authType !== "Bearer") {
        throw new Error("Expected a Bearer token");
      }

      const {
        claims: { sub },
      } = await jwtVerifier.verifyAccessToken(tokenValue, "api://default");
      const user = await oktaClient.getUser(sub);

      users.set(socket, {
        id: user.id,
        name: [user.profile.firstName, user.profile.lastName]
          .filter(Boolean)
          .join(" "),
      });
    } catch (error) {
      console.log(error);
    }
  }

  next();
}
class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on("getMessages", () => this.getMessages());
    socket.on("message", (value) => this.handleMessage(value));
    socket.on("disconnect", () => this.disconnect());
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  sendMessage(message) {
    this.io.sockets.emit("message", message);
  }

  getMessages() {
    messages.forEach((message) => this.sendMessage(message));
  }

  handleMessage(value) {
    const message = {
      id: uuidv4(),
      user: users.get(this.socket) || defaultUser,
      value,
      time: Date.now(),
    };

    messages.add(message);
    this.sendMessage(message);

    setTimeout(() => {
      messages.delete(message);
      this.io.sockets.emit("deleteMessage", message.id);
    }, messageExpirationTimeMS);
  }

  disconnect() {
    users.delete(this.socket);
  }
}

function chat(io) {
  io.on("connection", (socket) => {
    new Connection(io, socket);
  });
}

module.exports = chat;
