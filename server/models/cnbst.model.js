const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CnbstSchema = new Schema({
  gif_id: {
    type: String,
    required: true
  },
  gif_url: {
    type: String,
    required: true
  },
  bst_id: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = cnbst = mongoose.model("cnbst", CnbstSchema);