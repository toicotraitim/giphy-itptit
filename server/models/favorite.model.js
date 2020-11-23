const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FavoriteSchema = new Schema({
  gif_url: {
    type: String,
    required: true
  },
  gif_id: {
    type: String,
    required: true
  },
  user_id: {
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
module.exports = Favorite = mongoose.model("favorite", FavoriteSchema);