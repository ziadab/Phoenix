const route = require("express").Router();

route.get("/download", async (req, res) => {
  const fileName = req.query.filename;
  res.sendFile(__dirname + `/Songs/` + fileName + ".mp3");
  res.setHeader("Content-type", "audio/mpeg");
});

module.exports = route;
