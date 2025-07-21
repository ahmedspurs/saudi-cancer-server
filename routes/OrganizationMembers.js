const express = require("express");
const router = express.Router();
const {
  getOrganizationMembers,
  getOrganizationMembersById,
  createOrganizationMembers,
  updateOrganizationMembers,
  deleteOrganizationMembers,
  paginate,
  getOrganizationMembersByType,
  search,
} = require("../controllers/Api/OrganizationMembersController.js");
router.route("/").get(getOrganizationMembers).post(createOrganizationMembers);
router.route("/paginate").post(paginate);
router.route("/by-type").post(getOrganizationMembersByType);
router.route("/search").post(search);
router
  .route("/:id")
  .get(getOrganizationMembersById)
  .put(updateOrganizationMembers)
  .delete(deleteOrganizationMembers);
module.exports = router;
