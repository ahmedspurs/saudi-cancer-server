const express = require("express");
const router = express.Router();
const {
  getGovernance,
  getGovernanceById,
  createGovernance,
  updateGovernance,
  deleteGovernance,
  paginate,
  search,
  searchByType,
} = require("../controllers/Api/GovernanceController.js");
router.route("/").get(getGovernance).post(createGovernance);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router.route("/by-type").post(searchByType);
router
  .route("/:id")
  .get(getGovernanceById)
  .put(updateGovernance)
  .delete(deleteGovernance);
module.exports = router;
