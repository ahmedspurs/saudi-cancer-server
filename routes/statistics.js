const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/Api/StatisticsController.js");

router.get("/summary", statisticsController.getSummary);
router.get(
  "/donations-by-category",
  statisticsController.getDonationsByCategory
);
router.get("/monthly-donations", statisticsController.getMonthlyDonations);
router.get("/cases-by-status", statisticsController.getCasesByStatus);
router.get("/top-donations", statisticsController.getTopDonations);
router.get("/cases", statisticsController.getCases);
router.get("/categories", statisticsController.getCategories);

module.exports = router;
