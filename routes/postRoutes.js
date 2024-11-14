const { createPost, getPost, getPosts } = require("../controller/postControl");
const { loginMiddleware } = require("../middlewares/authMiddlewares");

const router = require("express").Router();

router.post("/create", loginMiddleware, createPost);
router.get("/all", getPosts);
router.get("/:id", getPost);

module.exports = router;
