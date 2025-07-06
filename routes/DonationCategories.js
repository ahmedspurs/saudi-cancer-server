const express = require("express");
const router = express.Router();
const {
  getDonationCategories,
  getDonationCategoriesById,
  createDonationCategories,
  updateDonationCategories,
  deleteDonationCategories,
  paginate,
  search,
} = require("../controllers/Api/DonationCategoriesController.js");
router.route("/").get(getDonationCategories).post(createDonationCategories);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getDonationCategoriesById)
  .put(updateDonationCategories)
  .delete(deleteDonationCategories);
module.exports = router;
