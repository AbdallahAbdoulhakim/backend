const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");

const saltRounds = 10;

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.verify = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (Object.keys(update).includes("password")) {
    const salt = await bcrypt.genSalt(saltRounds);
    const password = await bcrypt.hash(update.password, salt);

    this.setUpdate({ ...update, password });
  }
});
//Export the model
module.exports = mongoose.model("User", userSchema);
