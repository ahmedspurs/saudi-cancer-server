const express = require("express");
const router = express.Router();
const {
  getUserRoles,
  getUserRolesById,
  createUserRoles,
  updateUserRoles,
  deleteUserRoles,
  paginate,
  search,
} = require("../controllers/Api/UserRolesController.js");
router.route("/").get(getUserRoles).post(createUserRoles);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getUserRolesById)
  .put(updateUserRoles)
  .delete(deleteUserRoles);
module.exports = router;
