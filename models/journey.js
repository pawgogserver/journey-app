const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journeySchema = new Schema({
  date: String,
  title: String,
  description: String,
  authorId: String
});

module.exports = mongoose.model('Journey', journeySchema);
