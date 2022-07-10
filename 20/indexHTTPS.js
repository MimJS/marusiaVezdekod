const cors = require("cors");
const express = require("express");
const handleRequest = require("./handleRequest");
const fs = require("fs");
const https = require("https");
const path = require('path')
const options = {
  key: fs.readFileSync(path.join(__dirname, "../key.key")),
  cert: fs.readFileSync(path.join(__dirname, "../crt.crt")),
};
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
https.createServer(options, app).listen(8001)
app.post("/ws", (req, res) => {
  return res.send(handleRequest(req.body));
});
