const mongoose = require("mongoose"); // Erase if already required
const mongoosePaginate = require("mongoose-paginate-v2");

// Declare the Schema of the Mongo model
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

postSchema.plugin(mongoosePaginate);

//Export the model
module.exports = mongoose.model("Post", postSchema);
