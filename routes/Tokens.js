const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
// const { authenticate } = require("../middleware/auth"); // Your JWT authentication middleware
const { conn, sequelize } = require("../db/conn");
const { where } = require("sequelize");

router.post("/refresh-token", (req, res) => {
  console.log("refresh request");

  const refreshToken = req.cookies.refreshToken;
  console.log({ refreshToken });

  if (!refreshToken) {
    return res.status(401).json({
      status: false,
      msg: "لا يوجد Refresh Token، يرجى تسجيل الدخول مرة أخرى.",
    });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: false,
        msg: "Refresh Token غير صالح أو منتهي.",
      });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      status: true,
      data: { accessToken: newAccessToken },
    });
  });
});

router.get("/me", async (req, res) => {
  try {
    // Ensure req.user exists (set by authenticate middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: false,
        message: "Invalid token payload",
      });
    }

    const userId = req.user.id;
    console.log({ userId });

    const result = await conn.users.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: conn.user_roles,
          as: "user_roles",
          include: ["role"],
        },
      ],
    }); // Exclude sensitive fields

    console.log({ id: result.id });

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Return user data
    res.status(200).json({
      status: true,
      data: {
        id: result.id.toString(),
        role: result.role, // e.g., 'admin', 'result'
        email: result.email,
        name: result.name,
        phone: result.phone,
        roles: result.user_roles
          ? user_roles.map((role) => role.role.code)
          : null,
        // Add other non-sensitive fields as needed
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id || "unknown",
    });
    res.status(500).json({
      status: false,
      message: "Server error while fetching user data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined, // Include error details in dev mode
    });
  }
});

router.get("/profile", async (req, res) => {
  try {
    // Ensure req.user exists (set by authenticate middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: false,
        message: "Invalid token payload",
      });
    }

    const userId = req.user.id;
    console.log({ userId });

    const result = await conn.users.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: conn.donations_common,
          as: "donations_commons",
          include: ["case", "gift"],
        },
      ],
    }); // Exclude sensitive fields

    console.log({ id: result.id });

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const payments = await conn.payments.findAll({
      include: [
        {
          model: conn.donations_common,
          as: "donations_commons",
          where: {
            user_id: req.user.id,
          },
        },
      ],
    });

    // Return user data
    res.status(200).json({
      status: true,
      data: {
        id: result.id.toString(),
        role: result.role, // e.g., 'admin', 'result'
        email: result.email,
        name: result.name,
        phone: result.phone,
        payments,
        donations: result.donations_commons,
        // Add other non-sensitive fields as needed
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id || "unknown",
    });
    res.status(500).json({
      status: false,
      message: "Server error while fetching user data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined, // Include error details in dev mode
    });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.json({
    status: true,
    msg: "تم تسجيل الخروج بنجاح.",
  });
});

module.exports = router;
