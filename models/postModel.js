const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
});

//Export the model
module.exports = mongoose.model("Post", postSchema);
