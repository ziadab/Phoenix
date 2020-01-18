const route = require("express").Router();
const path = require("path");

route.get("/", async (req, res) => {
  const fileName = req.query.id;
  res.sendFile(path.join(__dirname, "../songs/") + fileName + ".mp3");
  res.setHeader("Content-type", "audio/mpeg");
});

module.exports = route;
