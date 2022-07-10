const cors = require("cors");
const express = require("express");
const handleRequest = require("./handleRequest");
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.listen(3000, () => console.log("Listening port: 3000"));
app.post("/ws", (req, res) => {
  return res.send(handleRequest(req.body));
});
