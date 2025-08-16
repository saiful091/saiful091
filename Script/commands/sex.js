module.exports.config = {
  name: "sex",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "SAHU",
  description: "Sex video with auto reaction",
  commandCategory: "Adult Content",
  usages: "",
  cooldowns: 1,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

const request = require("request");
const fs = require("fs-extra");
const path = require("path");

module.exports.handleEvent = async function({ api, event }) {
  if (event.body && event.body.toLowerCase().includes("sex")) {
    api.setMessageReaction("🥵", event.messageID, () => {}, true);

    const hi = ["হার মারবি না কিন্তু 🥵🫵"];
    const know = hi[Math.floor(Math.random() * hi.length)];

    const videoLinks = [
      "https://drive.google.com/uc?id=11-DAJbuvp78KowPBEsP-nP_ukGZPRaZW",
      "https://drive.google.com/uc?id=1189uVGqh2LCKb2LHmoPJrJ-VrGthBydZ",
      "https://drive.google.com/uc?id=11BymhX0TNEbtvSoRK8u52hfzdqjdlkqL",
      "https://drive.google.com/uc?id=11GmsStGJ0V0E8URgjwluMfAkHnxfnjox",
      "https://drive.google.com/uc?id=11M1LlRBGCSjSLDJ9sijBLkfOMW6T2EGi",
      "https://drive.google.com/uc?id=11QgjVOd2MWUn7YhJX_fJjbeqh1U5ZH5J",
      "https://drive.google.com/uc?id=11QMSvLBFAP9Iylug6svIL700Oz6JJf0r",
      "https://drive.google.com/uc?id=11Fxw7KjqJMFSAUq-8tzNvUmw5WZq9ymK",
      "https://drive.google.com/uc?id=11KrFcrBF9tUnGIX2aTlbBzBcvouZzvRe",
      "https://drive.google.com/uc?id=11NXhy4Jkdncdv1ZVeCejMfCFyXzDU0V4",
      "https://drive.google.com/uc?id=11weSOMAQScyo7aHDkVDgxnNvDSovO_ZV",
      "https://drive.google.com/uc?id=11xjsJnQYr5grlHMboxSLR0BUoVdxrZ_u",
      "https://drive.google.com/uc?id=127Xq-12UxZrp8x0kLmZBfVb0TILhVnC2",
      "https://drive.google.com/uc?id=12DpD0YRdPS4VgXIJcWzERUqtZRjmaoVj",
      "https://drive.google.com/uc?id=12T3dbV_CRRQl3_gDd_GhchdvrFl7RNqq",
      "https://drive.google.com/uc?id=12U6m8CqhHBYhR7pw5lSc59V7Zihoq__X",
      "https://drive.google.com/uc?id=12bKBo4O8MQpdMAT-CqLko9lwDTzMDrNu",
      "https://drive.google.com/uc?id=12VjO4v-2BKUGtAJ0tXZmX1p-j2g2qYt0",
      "https://drive.google.com/uc?id=12eBzB5FYhXHZNX8ES_rENF3LjEhGtPte",
      "https://drive.google.com/uc?id=12hvEPYGzTWLjLAwcMCb7jD3NVS1wmGcS"
    ];

    const randomLink = videoLinks[Math.floor(Math.random() * videoLinks.length)];
    const filePath = path.join(__dirname, "cache", "sex.mp4");

    request(encodeURI(randomLink))
      .pipe(fs.createWriteStream(filePath))
      .on("close", () => {
        api.sendMessage(
          { body: `「 ${know} 」`, attachment: fs.createReadStream(filePath) },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });
  }
};

module.exports.run = function() {};
