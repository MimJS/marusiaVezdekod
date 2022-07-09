const cors = require("cors");
const express = require("express");
const handleRequest10 = require("./10/handleRequest10");
const handleRequest20 = require("./20/handleRequest20");
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.listen(3000, () => console.log("Listening port: 3000"));
app.post("/ws20", (req, res) => {
  return res.send(handleRequest20(req.body));
});
app.post("/ws10", (req, res) => {
  return res.send(handleRequest10(req.body));
});
