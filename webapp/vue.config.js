let fs = require('fs');

module.exports = {
  outputDir: '../destiny2-bounty-tracker-web/docs',
  devServer: {
    https: {
      key: fs.readFileSync("../localhost-key.pem"),
      cert: fs.readFileSync("../localhost.pem"),
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
};