const express = require("express");
const router = express.Router();
const {
  getContactMessages,
  getContactMessagesById,
  createContactMessages,
  updateContactMessages,
  deleteContactMessages,
  paginate,
  search,
} = require("../controllers/Api/ContactMessagesController.js");
router.route("/").get(getContactMessages).post(createContactMessages);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getContactMessagesById)
  .put(updateContactMessages)
  .delete(deleteContactMessages);
module.exports = router;
