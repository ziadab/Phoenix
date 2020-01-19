module.exports = title => {
  if (title.indexOf("(") !== -1) {
    const texty = title.split("(")[0];
    if (title.indexOf("-") !== -1) {
      return texty.split("-");
    } else {
      return [null, null];
    }
  } else if (title.indexOf("[") !== -1) {
    const texty = title.split("[")[0];
    if (title.indexOf("-") !== -1) {
      return texty.split("-");
    } else {
      return [null, null];
    }
  } else if (title.indexOf("|") !== -1) {
    const texty = title.split("|")[0];
    if (title.indexOf("-") !== -1) {
      return texty.split("-");
    } else {
      return [null, null];
    }
  } else if (title.indexOf("{") !== -1) {
    const texty = title.split("{")[0];
    if (title.indexOf("-") !== -1) {
      return texty.split("-");
    } else {
      return [null, null];
    }
  } else if (title.indexOf("-") !== -1) {
    return title.split("-");
  } else {
    return [null, null];
  }
};
