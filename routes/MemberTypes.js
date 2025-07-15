const express = require("express");
const router = express.Router();
const {
  getMemberTypes,
  getMemberTypesById,
  createMemberTypes,
  updateMemberTypes,
  deleteMemberTypes,
  paginate,
  search,
} = require("../controllers/Api/MemberTypesController.js");
router.route("/").get(getMemberTypes).post(createMemberTypes);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getMemberTypesById)
  .put(updateMemberTypes)
  .delete(deleteMemberTypes);
module.exports = router;
