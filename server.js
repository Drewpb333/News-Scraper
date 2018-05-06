var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// require Articles and Comments Models
var db = require("./models");

var app = express();

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




app.listen(PORT, function(){
    console.log("Listening on PORT: " + PORT);
})