const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const findRemoveSync = require("find-remove");
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

  fs.readdir(uploadsDir, function(err, files) {
    files.forEach(function(file, index) {
      fs.stat(path.join(uploadsDir, file), function(err, stat) {
        var endTime, now;
        if (err) {
          return console.error(err);
        }
        now = new Date().getTime();
        endTime = new Date(stat.ctime).getTime() + 3600000;
        if (now > endTime) {
          return rimraf(path.join(uploadsDir, file), function(err) {
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
  const fileName = Math.random()
    .toString(36)
    .substring(7);

  var proc = new ffmpeg({ source: stream });
  proc
    .withAudioCodec("libmp3lame")
    .toFormat("mp3")
    .output(path.join(__dirname, "../songs/") + fileName + ".mp3")
    .on("end", () => {
      res.redirect(
        url.format({
          pathname: "/download",
          query: {
            id: fileName,
            artist,
            track
          }
        })
      );
    })
    .on("progress", chunk => {
      console.log(chunk.targetSize);
    })
    .run();
});

module.exports = route;
