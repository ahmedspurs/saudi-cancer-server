const express = require("express");
const router = express.Router();
const {
  getGovernanceCategories,
  getGovernanceCategoriesById,
  createGovernanceCategories,
  updateGovernanceCategories,
  deleteGovernanceCategories,
  paginate,
  search,
} = require("../controllers/Api/GovernanceCategoriesController.js");
router.route("/").get(getGovernanceCategories).post(createGovernanceCategories);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getGovernanceCategoriesById)
  .put(updateGovernanceCategories)
  .delete(deleteGovernanceCategories);
module.exports = router;
