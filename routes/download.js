const route = require("express").Router();
const getBuffer = require("../helpers/getBuffer");
const makeRequest = require("../helpers/makingRequest");
const path = require("path");
const fs = require("fs");
var contentDisposition = require("content-disposition");

const ID3Writer = require("browser-id3-writer");

route.get("/", async (req, res) => {
  const fileName = req.query.id;
  const track = req.query.track.trim();
  const artist = req.query.artist.trim();
  const song = fs.readFileSync(
    path.join(__dirname, "../songs/") + fileName + ".mp3"
  );

  const resp = await makeRequest(track, artist);

  if (resp != null) {
    // Getting data
    const [titleF, artistF, albumName, imageBuffer] = resp;
    // Get Buffred Image
    // Injecting data
    const writer = new ID3Writer(song);
    writer
      .setFrame("APIC", {
        type: 3,
        data: imageBuffer,
        description: "https://github.com/ziadab"
      })
      .setFrame("TIT2", titleF)
      .setFrame("TALB", albumName)
      .setFrame("TPE1", artistF);

    writer.addTag();

    // Download it xD
    res.setHeader("Content-type", "audio/mpeg");
    res.setHeader(
      "Content-disposition",
      contentDisposition(artistF[0].trim() + "-" + titleF.trim() + ".mp3")
    );
    //'Content-Disposition': contentDisposition(filename)
    res.end(Buffer.from(writer.arrayBuffer));
  } else {
    res.setHeader("Content-type", "audio/mpeg");
    res.end(song);
  }
});

module.exports = route;
