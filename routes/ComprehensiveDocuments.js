const express = require("express");
const router = express.Router();
const {
  getComprehensiveDocuments,
  getComprehensiveDocumentsById,
  createComprehensiveDocuments,
  updateComprehensiveDocuments,
  deleteComprehensiveDocuments,
  paginate,
  search,
} = require("../controllers/Api/ComprehensiveDocumentsController.js");
router
  .route("/")
  .get(getComprehensiveDocuments)
  .post(createComprehensiveDocuments);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getComprehensiveDocumentsById)
  .put(updateComprehensiveDocuments)
  .delete(deleteComprehensiveDocuments);
module.exports = router;
