const express = require("express");
const router = express.Router();
const {
  getPartners,
  getPartnersById,
  createPartners,
  updatePartners,
  deletePartners,
  paginate,
  search,
} = require("../controllers/Api/PartnersController.js");
router.route("/").get(getPartners).post(createPartners);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getPartnersById)
  .put(updatePartners)
  .delete(deletePartners);
module.exports = router;
