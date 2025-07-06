const express = require("express");
const router = express.Router();
const {
  getChats,
  getChatsById,
  createChats,
  updateChats,
  deleteChats,
  paginate,
  search,
} = require("../controllers/Api/ChatsController.js");
router.route("/").get(getChats).post(createChats);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router.route("/:id").get(getChatsById).put(updateChats).delete(deleteChats);
module.exports = router;
