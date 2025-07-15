const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPostsById,
  createPosts,
  updatePosts,
  deletePosts,
  paginate,
  search,
  searchByType,
} = require("../controllers/Api/PostsController.js");
router.route("/").get(getPosts).post(createPosts);
router.route("/paginate").post(paginate);
router.route("/by-type").post(searchByType);
router.route("/search").post(search);
router.route("/:id").get(getPostsById).put(updatePosts).delete(deletePosts);
module.exports = router;
