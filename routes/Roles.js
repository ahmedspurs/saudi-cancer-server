const express = require("express");
const router = express.Router();
const {
  getRoles,
  getRolesById,
  createRoles,
  updateRoles,
  deleteRoles,
  paginate,
  search,
} = require("../controllers/Api/RolesController.js");
router.route("/").get(getRoles).post(createRoles);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router.route("/:id").get(getRolesById).put(updateRoles).delete(deleteRoles);
module.exports = router;
