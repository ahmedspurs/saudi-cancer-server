const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid"); // For Node.js

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
  const given_id = uuidv4(); // Generates a random UUID (version 4)
  // Validate environment variable
  if (!process.env.MOYASAR_SECRET_KEY) {
    console.error("Moyasar secret key is not configured");
    return res.status(500).json({ message: "Server configuration error" });
  }
  console.log(
    {
      given_id,
      amount,
      currency,
      description,
      source: {
        type: source.type,
        token: source.token,
        ...tokenData,
        statement_descriptor: "Saudi Cancer",
        "3ds": true,
      },
      callback_url,
    },
    {
      auth: {
        username: process.env.MOYASAR_SECRET_KEY,
        password: "",
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  try {
    const response = await axios.post(
      "https://api.moyasar.com/v1/payments",
      {
        given_id,
        amount,
        currency,
        description,
        source: {
          type: source.type,
          token: source.token,
          ...tokenData,
          statement_descriptor: "Saudi Cancer",
          "3ds": true,
        },
        callback_url,
      },
      {
        auth: {
          username: process.env.MOYASAR_SECRET_KEY,
          password: "",
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Validate response
    console.log("completed");

    res.json({
      id: response.data.id,
      status: response.data.status,
      transaction_url: response.data.source.transaction_url,
    });
  } catch (error) {
    console.log("incompleted");

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
