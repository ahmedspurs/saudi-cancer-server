const express = require("express");
const router = express.Router();
const {
  getPostImages,
  getPostImagesById,
  createPostImages,
  updatePostImages,
  deletePostImages,
  paginate,
  search,
} = require("../controllers/Api/PostImagesController.js");
router.route("/").get(getPostImages).post(createPostImages);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getPostImagesById)
  .put(updatePostImages)
  .delete(deletePostImages);
module.exports = router;
