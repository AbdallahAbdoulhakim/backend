const {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controller/postControl");
const { loginMiddleware } = require("../middlewares/authMiddlewares");

const router = require("express").Router();

router.post("/create", loginMiddleware, createPost);
router.get("/all", getPosts);
router.put("/:id/update", loginMiddleware, updatePost);
router.delete("/:id/delete", loginMiddleware, deletePost);
router.get("/:id", getPost);

module.exports = router;
