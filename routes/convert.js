const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const findRemoveSync = require("find-remove");
const url = require("url");

const route = require("express").Router();

route.get("/convert", async (req, res) => {
  // Delete All Older file than 1 hour
  findRemoveSync(__dirname + "/Songs", { age: { seconds: 3600 } });

  // Converting then redirect to download page
  let title;
  const stream = ytdl(req.query.videoLink);
  const info = await ytdl.getInfo(req.query.videoLink);
  const fileName = Math.random()
    .toString(36)
    .substring(7);

  var proc = new ffmpeg({ source: stream });
  proc
    .withAudioCodec("libmp3lame")
    .toFormat("mp3")
    .saveToFile(__dirname + `/Songs/` + fileName + ".mp3")
    .on("progress", progress => {
      // console.log(JSON.stringify(progress));
      console.log("Processing: " + progress.targetSize + " KB converted");
    })
    .on("end", () => {
      res.redirect(
        url.format({
          pathname: "/download",
          query: {
            filename: fileName
          }
        })
      );
    });
});

module.exports = route;
