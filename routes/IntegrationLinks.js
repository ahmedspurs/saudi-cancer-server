const express = require("express");
const router = express.Router();
const {
  getIntegrationLinks,
  getIntegrationLinksById,
  createIntegrationLinks,
  updateIntegrationLinks,
  deleteIntegrationLinks,
  paginate,
  search,
} = require("../controllers/Api/IntegrationLinksController.js");
router.route("/").get(getIntegrationLinks).post(createIntegrationLinks);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getIntegrationLinksById)
  .put(updateIntegrationLinks)
  .delete(deleteIntegrationLinks);
module.exports = router;
