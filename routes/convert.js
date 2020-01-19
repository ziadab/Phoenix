const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const findRemoveSync = require("find-remove");
const url = require("url");
const path = require("path");
const fs = require("fs");
const getData = require("../helpers/extractArtistAndName");

const route = require("express").Router();

route.get("/", async (req, res) => {
  // make direction if doesn't exist
  fs.mkdirSync("songs", { recursive: true });

  // Delete All Older file than 1 hour
  findRemoveSync(__dirname + "/Songs", { age: { seconds: 3600 } });

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
