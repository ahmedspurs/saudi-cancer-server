const express = require("express");
const router = express.Router();
const {
  getCaseDonation,
  getCaseDonationById,
  createCaseDonation,
  updateCaseDonation,
  deleteCaseDonation,
  paginate,
  search,
} = require("../controllers/Api/CaseDonationController.js");
router.route("/").get(getCaseDonation).post(createCaseDonation);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getCaseDonationById)
  .put(updateCaseDonation)
  .delete(deleteCaseDonation);
module.exports = router;
