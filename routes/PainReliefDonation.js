const express = require("express");
const router = express.Router();
const {
  getPainReliefDonations,
  getPainReliefDonationsById,
  createPainReliefDonations,
  updatePainReliefDonations,
  deletePainReliefDonations,
  paginate,
  search,
} = require("../controllers/Api/PainReliefDonationController.js");
router.route("/").get(getPainReliefDonations).post(createPainReliefDonations);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getPainReliefDonationsById)
  .put(updatePainReliefDonations)
  .delete(deletePainReliefDonations);
module.exports = router;
