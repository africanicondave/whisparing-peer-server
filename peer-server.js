const express = require("express");
const { ExpressPeerServer } = require("peer");

const app = express();
const PORT = process.env.PORT || 9000;

const server = require("http").createServer(app);
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/peerjs",
  allow_discovery: true,
});

// Add CORS header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/peerjs", peerServer);

server.listen(PORT, () => {
  console.log(`✅ PeerJS Server is running on port ${PORT}`);
});
