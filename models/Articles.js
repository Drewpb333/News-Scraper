 var mongoose = require("mongoose");

 var Schema = mongoose.Schema;

 var ArticleSchema = new Schema({

     title: {
         type: String,
         required: true
     },

     link: {
         type: String,
         required: true
     },

     summary: {
         type: String,
     },

    //  for linking to notes model
     note: {
         type: Schema.Types.ObjectId,
         ref: "Notes"
     }
 });

 var Article = mongoose.model("Article", ArticleSchema);

 module.exports = Article;