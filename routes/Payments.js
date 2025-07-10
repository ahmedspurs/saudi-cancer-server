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
const axios = require("axios");
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

router.post("/moyasar", async (req, res) => {
  const { amount, currency, description, source, callback_url, tokenData } =
    req.body;

  // Input validation
  if (
    !amount ||
    !currency ||
    !description ||
    !source ||
    !source.type ||
    !source.token ||
    !callback_url
  ) {
    return res
      .status(400)
      .json({ message: "Missing or invalid required fields" });
  }

  // Validate environment variable
  if (!process.env.MOYASAR_SECRET_KEY) {
    console.error("Moyasar secret key is not configured");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const response = await axios.post(
      "https://api.moyasar.com/v1/payments",
      {
        amount,
        currency,
        description,
        source: {
          type: "card",
          token: source.token,
          ...tokenData,
        },
        callback_url,
      },
      {
        auth: {
          username: process.env.MOYASAR_SECRET_KEY, // Only secret key is needed
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Validate response data
    if (
      !response.data?.id ||
      !response.data?.status ||
      !response.data?.source?.transaction_url
    ) {
      console.error("Unexpected Moyasar API response:", response.data);
      return res
        .status(500)
        .json({ message: "Invalid response from payment gateway" });
    }

    res.json({
      id: response.data.id,
      status: response.data.status,
      transaction_url: response.data.source.transaction_url,
    });
  } catch (error) {
    // Handle specific Moyasar API errors
    if (error.response) {
      // Moyasar API returned an error response
      const { status, data } = error.response;
      console.error("Moyasar API error:", { status, errors: data.errors });
      return res.status(status || 500).json({
        message: "Payment creation failed",
        error: data?.message || error.message,
      });
    }

    // Handle network or other errors
    console.error("Error creating payment:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});
module.exports = router;
