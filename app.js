const convert = require("./routes/convert");
const download = require("./routes/convert");
const app = require("express")();

app.use("/convert", convert);

app.use("/download", download);

//
app.listen(process.env.PORT || 5000, () => {
  console.log(`Lol listing in ${process.env.PORT || 5000}`);
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
