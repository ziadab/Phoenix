const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const findRemoveSync = require("find-remove");
const url = require("url");

const route = require("express").Router();

route.get("/", async (req, res) => {
  // Delete All Older file than 1 hour
  findRemoveSync(__dirname + "/Songs", { age: { seconds: 3600 } });

  // Converting then redirect to download page
  let title;
  console.log(req.query.link);
  const stream = ytdl(req.query.link);
  const info = await ytdl.getInfo(req.query.link);
  const fileName = Math.random()
    .toString(36)
    .substring(7);

  var proc = new ffmpeg({ source: stream });
  proc
    .withAudioCodec("libmp3lame")
    .toFormat("mp3")
    .saveToFile(`./Songs/` + fileName + ".mp3")
    .on("end", () => {
      res.redirect(
        url.format({
          pathname: "/download",
          query: {
            id: fileName
          }
        })
      );
    })
    .on("progress", chunk => {
      console.log(chunk);
    });
});

module.exports = route;
