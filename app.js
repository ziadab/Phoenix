const axios = require("axios");
const app = require("express")();
const fs = require("fs");

app.get("/", async (req, res) => {
  axios({
    method: "get",
    url: "http://spotify-grabber.herokuapp.com/",
    responseType: "stream"
  }).then(function(response) {
    response.data.pipe(fs.createWriteStream("5ania.mp3"));
  });
  res.end("done");
});

app.listen(8080, () => {
  console.log("Lol everyting in 8080");
});
// var ffmpeg = require("fluent-ffmpeg");
// var command = ffmpeg("http://spotify-grabber.herokuapp.com/");
