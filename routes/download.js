const route = require("express").Router();
const getBuffer = require("../helpers/getBuffer");
const makeRequest = require("../helpers/makingRequest");
const path = require("path");
const fs = require("fs");
const { Readable } = require("stream");

const ID3Writer = require("browser-id3-writer");

route.get("/", async (req, res) => {
  const fileName = req.query.id;
  const track = req.query.track.trim();
  const artist = req.query.artist.trim();
  const song = fs.readFileSync(
    path.join(__dirname, "../songs/") + fileName + ".mp3"
  );

  const resp = await makeRequest(track, artist);
  //console.log(resp);
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

    // Sett data on Stream Object
    const final = new Readable();
    final._read = () => {};
    final.push(Buffer.from(writer.arrayBuffer));

    // Download it xD
    // res.set(
    //   "Content-disposition",
    //   `attachment; filename=${artistF}-${titleF}.mp3`
    // );
    res.setHeader("Content-type", "audio/mpeg");
    res.setHeader(
      "Content-disposition",
      `attachment; filename=${artistF[0].trim()} - ${titleF.trim()}.mp3`
    );
    res.end(Buffer.from(writer.arrayBuffer));
  } else {
    res.setHeader("Content-type", "audio/mpeg");
    res.end(song);
  }
});

module.exports = route;
