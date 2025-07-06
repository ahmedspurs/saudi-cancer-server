const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

const { conn } = require("../db/conn");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const router = express.Router();
const { sendEmail } = require("../utils/mail");
const jwt = require("jsonwebtoken");
const winston = require("winston"); // Structured logging
const sanitizeHtml = require("sanitize-html"); // For sanitizing inputs
require("dotenv").config();

// Logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/auth.log" }),
    new winston.transports.Console(),
  ],
});

// Validate environment variables
const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "TWITTER_CONSUMER_KEY",
  "TWITTER_CONSUMER_SECRET",
  "LINKEDIN_CLIENT_ID", // Add LinkedIn Client ID
  "LINKEDIN_CLIENT_SECRET", // Add LinkedIn Client Secret
  "JWT_SECRET",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    logger.error(`Missing environment variable: ${varName}`);
    process.exit(1);
  }
});

// Centralized OAuth configuration
const config = {
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://api.confe.ae"
      : "http://localhost:3030",
  redirectUrl:
    process.env.NODE_ENV === "production"
      ? "https://confe.ae/#"
      : "http://localhost:3000/#",
};

// Utility function to sanitize input
const sanitizeInput = (input) =>
  sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });

// Utility function to download and save profile image
const saveProfileImage = async (profileId, imageUrl) => {
  try {
    if (!imageUrl) return null;
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const imageName = `profile_${profileId}_${Date.now()}.jpg`;
    const imagePath = path.join(__dirname, "../public", imageName);
    await fs.writeFile(imagePath, imageResponse.data);
    return `/public/${imageName}`;
  } catch (err) {
    logger.error("Error saving profile image", { error: err.message });
    return null;
  }
};

// Utility function to create a new user
const createUser = async (profile, authType, email, roleId) => {
  const userData = {
    name: sanitizeInput(profile.displayName),
    email: sanitizeInput(email),
    phone: null, // Consider making this configurable or optional
    image: await saveProfileImage(profile.id, profile.photos?.[0]?.value),
    password: null, // Consider removing password for OAuth users
    auth_type: authType,
    role_id: roleId,
  };

  const user = await conn.users.create(userData);
  logger.info("Created user", { userId: user.id, email: user.email });

  // Send emails
  const templatePath = path.join(
    __dirname,
    "../templates/register-success.html"
  );
  const adminTemplatePath = path.join(
    __dirname,
    "../templates/admin/new-user.html"
  );

  let html = await fs.readFile(templatePath, "utf-8");
  html = html.replace(/\{user_name\}/g, user.name);

  let adminHtml = await fs.readFile(adminTemplatePath, "utf-8");
  adminHtml = adminHtml
    .replace(/\{user_name\}/g, user.name)
    .replace(/\{email\}/g, user.email)
    .replace(/\{phone\}/g, user.phone);

  await Promise.all([
    sendEmail(user.email, "Welcome To Confe World", html),
    sendEmail("confe.ae@gmail.com", "🔔 New User Registration", adminHtml),
  ]);

  return user;
};

// Google OAuth 2.0 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${config.baseUrl}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        logger.info("Processing Google OAuth", { profileId: profile.id });
        if (!profile.emails?.[0]?.value) {
          throw new Error("No email provided by Google");
        }

        let user = await conn.users.findOne({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          const role = await conn.user_roles.findOne({
            where: { code: "STD" },
          });
          if (!role) {
            throw new Error("Role 'STD' not found");
          }
          user = await createUser(
            profile,
            "google",
            profile.emails[0].value,
            role.id
          );
        }

        return done(null, user);
      } catch (err) {
        logger.error("Error in GoogleStrategy", { error: err.message });
        return done(err, null);
      }
    }
  )
);

// Twitter OAuth 1.0a Strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${config.baseUrl}/api/auth/twitter/callback`,
      includeEmail: true,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        logger.info("Processing Twitter OAuth", { profileId: profile.id });
        const email =
          profile.emails?.[0]?.value || `twitter_${profile.id}@example.com`;

        let user = await conn.users.findOne({ where: { email } });

        if (!user) {
          const role = await conn.user_roles.findOne({
            where: { code: "STD" },
          });
          if (!role) {
            throw new Error("Role 'STD' not found");
          }
          user = await createUser(profile, "twitter", email, role.id);
        }

        return done(null, user);
      } catch (err) {
        logger.error("Error in TwitterStrategy", { error: err.message });
        return done(err, null);
      }
    }
  )
);
// Add LinkedIn OAuth 2.0 Strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${config.baseUrl}/api/auth/linkedin/callback`,
      scope: ["openid", "email"],
      state: true, // Recommended for security
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        logger.info("Processing LinkedIn OAuth", { profileId: profile.id });
        if (!profile.emails?.[0]?.value) {
          throw new Error("No email provided by LinkedIn");
        }

        let user = await conn.users.findOne({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          const role = await conn.user_roles.findOne({
            where: { code: "STD" },
          });
          if (!role) {
            throw new Error("Role 'STD' not found");
          }
          user = await createUser(
            profile,
            "linkedin",
            profile.emails[0].value,
            role.id
          );
        }

        return done(null, user);
      } catch (err) {
        logger.error("Error in LinkedInStrategy", { error: err.message });
        return done(err, null);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  logger.info("Serializing user", { userId: user.id });
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await conn.users.findOne({ where: { id } });
    if (!user) {
      logger.warn("User not found during deserialization", { userId: id });
      return done(null, null);
    }
    done(null, user);
  } catch (err) {
    logger.error("Error in deserializeUser", { error: err.message });
    done(err, null);
  }
});

// Authentication Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${config.redirectUrl}/login?error=1`,
  }),
  (req, res) => {
    logger.info("Google callback: User authenticated", { userId: req.user.id });
    res.redirect(`${config.redirectUrl}/profile`);
  }
);

router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: `${config.redirectUrl}/login?error=1`,
  }),
  (req, res) => {
    logger.info("Twitter callback: User authenticated", {
      userId: req.user.id,
    });
    res.redirect(`${config.redirectUrl}/profile`);
  }
);

// Add LinkedIn Authentication Routes
router.get(
  "/linkedin",
  passport.authenticate("linkedin", {
    scope: ["openid", "email"],
  })
);

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    failureRedirect: `${config.redirectUrl}/login?error=1`,
  }),
  (req, res) => {
    logger.info("LinkedIn callback: User authenticated", {
      userId: req.user.id,
    });
    res.redirect(`${config.redirectUrl}/profile`);
  }
);

// User Route
router.get("/user", (req, res) => {
  if (!req.user) {
    logger.warn("Unauthorized access to /user route");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = jwt.sign(
    {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
    process.env.JWT_SECRET // Add token expiration
  );

  res.json({
    status: true,
    data: {
      user: {
        id: req.user.id,
        displayName: req.user.name,
        email: req.user.email,
        phone: req.user.phone || null,
        image: req.user.image || null,
      },
      token,
    },
  });
});

// Logout Route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      logger.error("Logout error", { error: err.message });
      return res.status(500).json({ message: "Error during logout" });
    }
    logger.info("User logged out");
    res.redirect(`${config.redirectUrl}/login`);
  });
});

module.exports = router;
