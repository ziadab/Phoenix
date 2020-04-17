require("dotenv").config();
const ColorThief = require("colorthief");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const makeRequest = require("../helpers/makingRequest");
const removeOld = require("../helpers/deleteOldSong");
const url = require("url");
const path = require("path");
const fs = require("fs");
const getData = require("../helpers/extractArtistAndName");
const rgbToHex = require("../helpers/rgbToHex");

const route = require("express").Router();

route.get("/", async (req, res) => {
  // make direction if doesn't exist
  fs.mkdirSync("songs", { recursive: true });

  // Delete All Older file than 1 hour

  // Converting then redirect to download page
  let title;
  //console.log(req.query.link);
  const stream = ytdl(req.query.link);
  const info = await ytdl.getInfo(req.query.link);
  const [artist, track] = getData(info.title);
  console.log(artist, track);
  const resp = await makeRequest(track, artist);
  let error, data, titleF, artistF, albumName, coverImage, albumCover;

  //console.log(resp);
  if (resp.error !== null) {
    error = resp.error;
  } else {
    data = resp.data;
  }
  try {
    [titleF, artistF, albumName, coverImage, albumCover] = data;
  } catch (e) {}

  const fileName = Math.random().toString(36).substring(7);

  var proc = new ffmpeg({ source: stream });
  proc
    .withAudioCodec("libmp3lame")
    .toFormat("mp3")
    .output(path.join(__dirname, "../songs/") + fileName + ".mp3")
    .on("start", () => {
      removeOld();
    })
    .on("end", async () => {
      //console.log(resp);
      const downloadLink =
        `http://${process.env.HOST}:${process.env.PORT || 5000}` +
        url.format({
          pathname: "/download",
          query: {
            id: fileName,
            artist,
            track,
          },
        });

      if (resp.error !== null) {
        res.status(404).json({
          error,
          downloadLink,
        });
      } else {
        const background = await ColorThief.getColor(albumCover);
        const hex = rgbToHex(background[0], background[1], background[2]);
        res.status(200).json({
          albumCover,
          title: titleF,
          artist: artistF,
          albumName,
          downloadLink,
          background: hex,
          error,
        });
      }
    })

    .on("progress", (chunk) => {
      console.log(chunk.targetSize);
    })
    .run();
});

module.exports = route;
