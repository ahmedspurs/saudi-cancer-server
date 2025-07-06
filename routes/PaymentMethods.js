const express = require("express");
const router = express.Router();
const {
  getPaymentMethods,
  getPaymentMethodsById,
  createPaymentMethods,
  updatePaymentMethods,
  deletePaymentMethods,
  paginate,
  search,
} = require("../controllers/Api/PaymentMethodsController.js");
router.route("/").get(getPaymentMethods).post(createPaymentMethods);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getPaymentMethodsById)
  .put(updatePaymentMethods)
  .delete(deletePaymentMethods);
module.exports = router;
