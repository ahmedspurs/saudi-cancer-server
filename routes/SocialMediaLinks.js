const express = require("express");
const router = express.Router();
const {
  getSocialMediaLinks,
  getSocialMediaLinksById,
  createSocialMediaLinks,
  updateSocialMediaLinks,
  deleteSocialMediaLinks,
  paginate,
  search,
} = require("../controllers/Api/SocialMediaLinksController.js");
router.route("/").get(getSocialMediaLinks).post(createSocialMediaLinks);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getSocialMediaLinksById)
  .put(updateSocialMediaLinks)
  .delete(deleteSocialMediaLinks);
module.exports = router;
