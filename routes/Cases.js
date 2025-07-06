const express = require("express");
const router = express.Router();
const {
  getCases,
  getCasesById,
  createCases,
  updateCases,
  deleteCases,
  paginate,
  search,
  paginateDashboard,
  byType,
} = require("../controllers/Api/CasesController.js");
router.route("/").get(getCases).post(createCases);
router.route("/paginate").post(paginate);
router.route("/paginate/filtered").post(paginateDashboard);
router.route("/search").post(search);
router.route("/by-type").post(byType);
router.route("/:id").get(getCasesById).put(updateCases).delete(deleteCases);
module.exports = router;
