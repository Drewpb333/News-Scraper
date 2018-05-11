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

// Route for getting all Articles from the db
app.get("/", function(req, res) {
  db.Article.find({saved: false})
    .then(function(dbArticle) {
      res.render("articles", {
        articles: dbArticle});
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//retrieves info from ESPN
app.get("/scrape", function (req, res) {
  axios.get("http://espn.com/").then(function (response) {
    //utilize jQuery formatting server-side
    var $ = cheerio.load(response.data);

    var results = [];

    $("a").each(function (i, element) {

      var link = "http://espn.com/" + $(element).attr("href");
      var title = $(element).text();
      results.push({
        title: title,
        link: link
      });
    });

    //numbers for headline links in html
    for (var i = 75; i < 81; i++) {
      var result = results[i];
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    }

    res.send("Scrape has been completed.")
  })
})

// get all articles from db
app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
      console.log(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// specific article route
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({
      _id: req.params.id
    })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
      console.log(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Route for saving/updating an article's comments
app.post("/articles/:id", function (req, res) {
  db.Comments.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("Listening on PORT: " + PORT);
})