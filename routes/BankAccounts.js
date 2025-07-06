const express = require("express");
const router = express.Router();
const {
  getBankAccounts,
  getBankAccountsById,
  createBankAccounts,
  updateBankAccounts,
  deleteBankAccounts,
  paginate,
  search,
} = require("../controllers/Api/BankAccountsController.js");
router.route("/").get(getBankAccounts).post(createBankAccounts);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getBankAccountsById)
  .put(updateBankAccounts)
  .delete(deleteBankAccounts);
module.exports = router;
