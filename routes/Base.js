const express = require("express");
const router = express.Router();
const {
  getDonationChart,
  getDashboardStats,
  getRecentDonations,
  getRecentPatientCases,
} = require("../controllers/Api/BaseController");

router.get("/states", getDashboardStats);
router.get("/recent-donations", getRecentDonations);
router.get("/recent-patient-cases", getRecentPatientCases);
router.get("/donation-chart", getDonationChart);

module.exports = router;
