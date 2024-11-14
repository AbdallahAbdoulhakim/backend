const express = require("express");
const {
  updateUser,
  getUser,
  deleteUser,
  blockUser,
  unblockUser,
  getUsers,
} = require("../controller/userControl");
const {
  adminMiddleware,
  ownMiddleware,
} = require("../middlewares/authMiddlewares");

const router = express.Router();

router.put("/update/:id", adminMiddleware, updateUser);
router.put("/update", ownMiddleware, updateUser);

router.delete("/delete/:id", adminMiddleware, deleteUser);
router.delete("/delete", ownMiddleware, deleteUser);

router.patch("/block/:id", adminMiddleware, blockUser);
router.patch("/unblock/:id", adminMiddleware, unblockUser);

router.get("/all", adminMiddleware, getUsers);

router.get("/:id", adminMiddleware, getUser);
router.get("/", ownMiddleware, getUser);

module.exports = router;
