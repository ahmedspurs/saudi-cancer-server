const express = require("express");
const router = express.Router();
const {
  getPayments,
  getPaymentsById,
  createPayments,
  updatePayments,
  deletePayments,
  paginate,
  checkout,
  verify,
  paymentWebhook,
  getUserPaymentsById,
  search,
} = require("../controllers/Api/PaymentsController.js");
router.route("/").get(getPayments).post(createPayments);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router.route("/verify").get(verify);
router.route("/webhook").post(paymentWebhook);
router.route("/checkout").post(checkout);
router.route("/user/reciept").post(getUserPaymentsById);
router
  .route("/:id")
  .get(getPaymentsById)
  .put(updatePayments)
  .delete(deletePayments);
module.exports = router;
