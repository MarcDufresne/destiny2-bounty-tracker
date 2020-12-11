let fs = require('fs');

module.exports = {
  outputDir: '../destiny2-bounty-tracker-web/docs',
  devServer: {
    host: 'localhost',
    port: 8000,
    https: {
      key: fs.readFileSync("../localhost-key.pem"),
      cert: fs.readFileSync("../localhost.pem"),
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
};