const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUsersById,
  register,
  updateUsers,
  deleteUsers,
  paginate,
  search,
  login,
  updatePass,
  sendOtp,
  verifyOtp,
  updatePassword,
  getUserProfileById,
  updateAdminPassword,
  donorRegister,
  updateUserProfile,
  adminLogin,
} = require("../controllers/Api/UsersController.js");
router.route("/").get(getUsers).post(register);

router.route("/donor-register").post(donorRegister);
router.route("/login").post(login);
router.route("/admin-login").post(adminLogin);
router.route("/edit-pass").post(updatePass);
router.route("/paginate").post(paginate);
router.route("/:id/password").post(updateAdminPassword);
router.route("/search").post(search);
router.route("/profile/:id").get(getUserProfileById);
router.route("/profile/:id").put(updateUserProfile);
router.route("/verify-otp").post(verifyOtp);
router.route("/forgot-password").post(sendOtp);
router.route("/update-password").post(updatePassword);
router.route("/:id").get(getUsersById).put(updateUsers).delete(deleteUsers);
module.exports = router;
