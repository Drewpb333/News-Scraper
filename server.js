var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// require Articles and Comments Models
var db = require("./models");

var app = express();

var PORT = process.env.PORT || 3000;

// Connects to heroku first if possible
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//retrieves info from ESPN
app.get("/scrape", function (req, res) {
  axios.get("http://espn.com/").then(function (response) {
    //utilize jQuery formatting server-side
    var $ = cheerio.load(response.data);

    var results = [];

    $(".headlineStack__listContainer").each(function (i, element) {

      var link = $(element).children().attr("href");
      var title = $(element).children().text();
      console.log(link);
      console.log(title);
      console.log(i + "/n-----------");
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        link: link
      });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log("\n\------------" + results);
  })
})


app.listen(PORT, function () {
  console.log("Listening on PORT: " + PORT);
})