const express = require("express");
const router = express.Router();
const {
  getDonationCommon,
  getDonationCommonById,
  createDonationCommon,
  updateDonationCommon,
  deleteDonationCommon,
  paginate,
  search,
} = require("../controllers/Api/DonationCommonController.js");
router.route("/").get(getDonationCommon).post(createDonationCommon);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getDonationCommonById)
  .put(updateDonationCommon)
  .delete(deleteDonationCommon);
module.exports = router;
