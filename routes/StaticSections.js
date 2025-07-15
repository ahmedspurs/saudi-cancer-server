const express = require("express");
const router = express.Router();
const {
  getStaticSections,
  getStaticSectionsById,
  createStaticSections,
  updateStaticSections,
  deleteStaticSections,
  paginate,
  search,
  byType,
} = require("../controllers/Api/StaticSectionsController.js");
router.route("/").get(getStaticSections).post(createStaticSections);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router.route("/by-type").post(byType);
router
  .route("/:id")
  .get(getStaticSectionsById)
  .put(updateStaticSections)
  .delete(deleteStaticSections);
module.exports = router;
