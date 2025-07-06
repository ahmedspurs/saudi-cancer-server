const express = require("express");
const router = express.Router();
const {
  getGiftDonations,
  getGiftDonationsById,
  createGiftDonations,
  updateGiftDonations,
  deleteGiftDonations,
  paginate,
  search,
} = require("../controllers/Api/GiftDonationsController.js");
router.route("/").get(getGiftDonations).post(createGiftDonations);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getGiftDonationsById)
  .put(updateGiftDonations)
  .delete(deleteGiftDonations);
module.exports = router;
