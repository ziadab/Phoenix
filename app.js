const app = require("express")();
const ytdl = require("ytdl-core");
var ffmpeg = require("fluent-ffmpeg");
var findRemoveSync = require("find-remove");
const url = require("url");

app.get("/convert", async (req, res) => {
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

app.get("/download", async (req, res) => {
  const fileName = req.query.filename;
  res.sendFile(__dirname + `/Songs/` + fileName + ".mp3");
  res.setHeader("Content-type", "audio/mpeg");
});

//
app.listen(8080, () => {
  console.log("Lol everyting in 8080");
});

/*
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
