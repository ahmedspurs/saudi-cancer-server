// routes/reports.js
const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/Api/ReportsController.js");

// مسارات تقارير التبرعات
router.get("/donations", reportsController.getDonations);
router.get("/donations-by-category", reportsController.getDonationsByCategory);
router.get("/donations-timeline", reportsController.getDonationsTimeline);
// مسارات تقارير الحالات
router.get("/cases", reportsController.getCases);
router.get("/cases-by-status", reportsController.getCasesByStatus);
router.get("/cases-timeline", reportsController.getCasesTimeline);
router.get("/payments", reportsController.getPayments);
router.get("/payments-by-status", reportsController.getPaymentsByStatus);
router.get("/payments-timeline", reportsController.getPaymentsTimeline);

module.exports = router;
