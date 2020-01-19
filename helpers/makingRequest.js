const axios = require("axios");
const getBuffer = require("./getBuffer");

module.exports = async (track, artist) => {
  let res = null;
  const link = encodeURI(
    `https://spotify-grabber.herokuapp.com/?title=${artist} ${track}&type=track`
  );
  try {
    res = await axios.get(link);
  } catch (e) {
    return null;
  } finally {
    const data = res.data;
    // Sure that will not change between track and album
    const coverImage = await getBuffer(data.albumCover);
    const artist = data.artists;
    const albumName = data.albumName;
    const title = data.title;

    return [title, artist, albumName, coverImage];
  }
};
