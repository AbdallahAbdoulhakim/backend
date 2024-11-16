const ObjectId = require("mongoose").Types.ObjectId;

const isValidBson = (id) => {
  return ObjectId.isValid(id);
};

module.exports = { isValidBson };
