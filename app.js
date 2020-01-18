const convert = require("./routes/convert");
const download = require("./routes/download");
const app = require("express")();

app.use("/download", download);
app.use("/convert", convert);

//
app.listen(process.env.PORT || 5000, () => {
  console.log(`Lol listing in ${process.env.PORT || 5000}`);
});
