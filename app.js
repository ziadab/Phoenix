const axios = require("axios");
const app = require("express")();
const fs = require("fs");
const ytdl = require("ytdl-core");
var ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");

app.get("/", async (req, res) => {
  let title;
  const stream = ytdl(req.query.videoLink);
  const info = await ytdl.getInfo(req.query.videoLink);
  const forBuffer = new PassThrough();

  // stream.on("info", info => {
  //   title = info.title;
  //   console.log(info.title);
  // });

  // res.setHeader(
  //   "Content-disposition",
  //   "attachment; filename=" + info.title + ".mp3"
  // );
  // res.setHeader("Content-type", "audio/mpeg");

  var proc = new ffmpeg({ source: stream });
  let buffer = [];
  proc
    .withAudioCodec("libmp3lame")
    .toFormat("mp3")
    .saveToFile("Lol.mp3")
    .run();
  //.pipe(res, { end: true });
  proc.on("data", chunk => {
    buffer.push(chunk);
    console.log("HORA");
  });

  proc.on("end", function() {
    //res.send(buffer);
  });
  proc.on("error", err => {
    console.log(`Hak bossa ${err.message}`);
  });

  //res.send(info.title);

  // res.end(forBuffer);
  //res.end("lol");
});

//
app.listen(8080, () => {
  console.log("Lol everyting in 8080");
});

/*
  TODO: THIS SSTUFF FOR LATER
  */
// var ffmpeg = require("fluent-ffmpeg");
// var command = ffmpeg("http://spotify-grabber.herokuapp.com/");
// app.get("/", async (req, res) => {
//   axios({
//     method: "get",
//     url: "http://spotify-grabber.herokuapp.com/",
//     responseType: "stream"
//   }).then(function(response) {
//     response.data.pipe(fs.createWriteStream("5ania.mp3"));
//   });
//   res.end("done");
// });
