var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NotesSchema = new Schema({
    title: String,
    body: String
})

var Comments = mongoose.model("Notes", CommentsSchema);

module.exports = Comments;