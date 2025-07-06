const express = require("express");
const router = express.Router();
const {
  getPainReliefOptions,
  getPainReliefOptionsById,
  createPainReliefOptions,
  updatePainReliefOptions,
  deletePainReliefOptions,
  paginate,
  search,
} = require("../controllers/Api/PainReliefOptionController.js");
router.route("/").get(getPainReliefOptions).post(createPainReliefOptions);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getPainReliefOptionsById)
  .put(updatePainReliefOptions)
  .delete(deletePainReliefOptions);
module.exports = router;
