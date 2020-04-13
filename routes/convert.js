require("dotenv").config();
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const makeRequest = require("../helpers/makingRequest");
const url = require("url");
const path = require("path");
const fs = require("fs");
const getData = require("../helpers/extractArtistAndName");
const rimraf = require("rimraf");

const route = require("express").Router();

route.get("/", async (req, res) => {
  // make direction if doesn't exist
  fs.mkdirSync("songs", { recursive: true });

  // Delete All Older file than 1 hour
  var uploadsDir = path.join(__dirname, "../songs/");

  fs.readdir(uploadsDir, function (err, files) {
    files.forEach(function (file, index) {
      fs.stat(path.join(uploadsDir, file), function (err, stat) {
        var endTime, now;
        if (err) {
          return console.error(err);
        }
        now = new Date().getTime();
        endTime = new Date(stat.ctime).getTime() + 3600000;
        if (now > endTime) {
          return rimraf(path.join(uploadsDir, file), function (err) {
            if (err) {
              return console.error(err);
            }
            console.log("successfully deleted");
          });
        }
      });
    });
  });

  // Converting then redirect to download page
  let title;
  //console.log(req.query.link);
  const stream = ytdl(req.query.link);
  const info = await ytdl.getInfo(req.query.link);
  const [artist, track] = getData(info.title);
  const resp = await makeRequest(track, artist);
  const [titleF, artistF, albumName, imageBuffer, albumCover] = resp;
  const fileName = Math.random().toString(36).substring(7);

  var proc = new ffmpeg({ source: stream });
  proc
    .withAudioCodec("libmp3lame")
    .toFormat("mp3")
    .output(path.join(__dirname, "../songs/") + fileName + ".mp3")
    .on("end", () => {
      res.json({
        albumCover,
        titleF,
        artistF,
        albumName,
        downloadLink:
          `http://${process.env.HOST}:${process.env.PORT || 5000}` +
          url.format({
            pathname: "/download",
            query: {
              id: fileName,
              artist,
              track,
              //data: Buffer.from(JSON.stringify(resp)).toString("base64"),
            },
          }),
      });
    })
    .on("progress", (chunk) => {
      console.log(chunk.targetSize);
    })
    .run();
});

module.exports = route;
