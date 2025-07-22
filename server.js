const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/.env` });
const cors = require("cors");
const cookieParser = require("cookie-parser");
// global.loadLocaleMessages = require("locnode");
// const session = require("express-session");
const { sequelize } = require("./db/conn.js");
const fileEasyUpload = require("express-easy-fileuploader");
const file_upload = require("./middleware/media_middleware");
const chats = require("./routes/Chats.js");
const contact_messages = require("./routes/ContactMessages.js");
const donation_categories = require("./routes/DonationCategories.js");
const donations_common = require("./routes/DonationsCommon.js");
const gift_donations = require("./routes/GiftDonations.js");
const integration_links = require("./routes/IntegrationLinks.js");
const pain_relief_donations = require("./routes/PainReliefDonation.js");
const pain_relief_options = require("./routes/PainReliefOption.js");
const pain_relief_programs = require("./routes/PainReliefPrograms.js");
const cases_donation = require("./routes/CaseDonation.js");
const cases = require("./routes/Cases.js");
const payment_methods = require("./routes/PaymentMethods.js");
const payments = require("./routes/Payments.js");
const roles = require("./routes/Roles.js");
const user_roles = require("./routes/UserRoles.js");
const users = require("./routes/Users.js");
const base = require("./routes/Base.js");
// const auth = require("./routes/Auth.js");
const statistics = require("./routes/statistics.js");
const governance_categories = require("./routes/GovernanceCategories.js");
const governance = require("./routes/Governance.js");
const posts = require("./routes/Posts.js");
const post_types = require("./routes/PostTypes.js");
const post_images = require("./routes/PostImages.js");
const static_sections = require("./routes/StaticSections.js");
const organization_members = require("./routes/OrganizationMembers.js");
const comprehensive_documents = require("./routes/ComprehensiveDocuments.js");
const social_media_links = require("./routes/SocialMediaLinks.js");
const reports = require("./routes/Reports");
const tokens = require("./routes/Tokens");
const bank_accounts = require("./routes/BankAccounts.js");
const member_types = require("./routes/MemberTypes.js");
const partners = require("./routes/Partners.js");

const port = process.env.PORT || 3030;
const app = express();
const bodyParser = require("body-parser");
const { authenticate } = require("./middleware/authenticate.js");
// const passport = require("passport");

// const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://store.ratlclinic.com",
  "https://store.scf.org.sa",
  "http://store.scf.org.sa",
  "https://dashboard.scf.org.sa",
  "http://dashboard.scf.org.sa",
  "https://api.scf.org.sa",
  "http://api.scf.org.sa",
  "https://scf.org.sa",
  "http://scf.org.sa",
  "https://www.scf.org.sa",
  "http://www.scf.org.sa",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); // فقط قيمة واحدة
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ضروري لقبول preflight
app.options("*", cors());

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "fallback_secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//       sameSite: "lax",
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

// إعداد Passport.js
// app.use(passport.initialize());
// app.use(passport.session());
// app.use((req, res, next) => {
//   res.setHeader(
//     "Cache-Control",
//     "no-store, no-cache, must-revalidate, proxy-revalidate"
//   );
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//   next();
// });
app.use(
  fileEasyUpload({
    app,
    fileUploadOptions: {
      limits: { fileSize: 50 * 1024 * 1024 },
    },
  })
);
app.use(bodyParser.json({ limit: "10000mb" }));
app.use(express.static(__dirname + "/public/"));
app.use(cookieParser());
app.use("/api/static", express.static("uploads"));
app.use(file_upload);
app.use(authenticate);
// app.use("/api/auth", auth); // إضافة مسارات المصادقة
app.use("/api/chats", chats);
app.use("/api/bank-accounts", bank_accounts);
app.use("/api/contact-messages", contact_messages);
app.use("/api/donation-categories", donation_categories);
app.use("/api/donations-common", donations_common);
app.use("/api/gift-donations", gift_donations);
app.use("/api/integration-links", integration_links);
app.use("/api/pain-relief-donations", pain_relief_donations);
app.use("/api/pain-relief-options", pain_relief_options);
app.use("/api/pain-relief-programs", pain_relief_programs);
app.use("/api/case-donations", cases_donation);
app.use("/api/cases", cases);
app.use("/api/payment-methods", payment_methods);
app.use("/api/payments", payments);
app.use("/api/roles", roles);
app.use("/api/user-roles", user_roles);
app.use("/api/users", users);
app.use("/api/base", base);
app.use("/api/statistics", statistics);
app.use("/api/reports", reports);
app.use("/api/static-sections", static_sections);
app.use("/api/organization-members", organization_members);
app.use("/api/comprehensive-documents", comprehensive_documents);
app.use("/api/social-media-links", social_media_links);
app.use("/api/governance", governance);
app.use("/api/governance-categories", governance_categories);
app.use("/api/post-types", post_types);
app.use("/api/posts", posts);
app.use("/api/post-images", post_images);
app.use("/api/tokens", tokens);
app.use("/api/partners", partners);
app.use("/api/member-types", member_types);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
module.exports = app;
