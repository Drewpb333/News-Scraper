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

    //  for linking to comments model
     note: {
         type: Schema.Types.ObjectId,
         ref: "Note"
     }
 });

 var Article = mongoose("Article", ArticleSchema);

 module.exports = Article;