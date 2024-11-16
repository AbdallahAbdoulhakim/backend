const {
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
} = require("../controller/commentControl");
const { loginMiddleware } = require("../middlewares/authMiddlewares");

const router = require("express").Router();

router.get("/:id", getCommentById);
router.post("/:id/create", loginMiddleware, createComment);
router.put("/:id/update", loginMiddleware, updateComment);
router.delete("/:id/delete", loginMiddleware, deleteComment);

module.exports = router;
