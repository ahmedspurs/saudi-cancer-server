const express = require("express");
const router = express.Router();
const {
  getPainReliefPrograms,
  getPainReliefProgramsById,
  createPainReliefPrograms,
  updatePainReliefPrograms,
  deletePainReliefPrograms,
  paginate,
  search,
} = require("../controllers/Api/PainReliefProgramsController.js");
router.route("/").get(getPainReliefPrograms).post(createPainReliefPrograms);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getPainReliefProgramsById)
  .put(updatePainReliefPrograms)
  .delete(deletePainReliefPrograms);
module.exports = router;
