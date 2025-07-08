const express = require("express");
const router = express.Router();
const {
  getPostTypes,
  getPostTypesById,
  createPostTypes,
  updatePostTypes,
  deletePostTypes,
  paginate,
  search,
} = require("../controllers/Api/PostTypesController.js");
router.route("/").get(getPostTypes).post(createPostTypes);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getPostTypesById)
  .put(updatePostTypes)
  .delete(deletePostTypes);
module.exports = router;
