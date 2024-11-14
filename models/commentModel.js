const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

//Export the model
module.exports = mongoose.model("Comment", commentSchema);
