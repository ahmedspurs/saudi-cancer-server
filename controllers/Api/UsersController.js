const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config({ path: `${__dirname}/../../.env` });
const SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");
const { sendEmail } = require("../../utils/mail");
const path = require("path");

exports.register = async (req, res, next) => {
  let transaction;
  try {
    console.log("Request body:", req.body);
    transaction = await sequelize.transaction();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req?.body?.password, salt);
    req.body.password_hash = hash;

    // Validate required fields
    if (
      !req?.body?.name ||
      !req?.body?.email ||
      !req?.body?.password ||
      !req?.body?.role_id
    ) {
      return res.status(400).json({
        status: false,
        msg: "Please fill all required fields (name, email, password, role_ids as array)",
      });
    }

    // Check for existing user
    const existingUser = await conn.users.findOne({
      where: { email: req.body.email },
      transaction,
    });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        msg: "Email already exists",
      });
    }

    // Validate phone
    if (req?.body?.phone && req?.body?.phone.length < 9) {
      return res.status(400).json({
        status: false,
        msg: "رقم الهاتف يجب أن يكون 9 أرقام على الأقل",
      });
    }

    // Validate password length
    if (req?.body?.password.length < 6) {
      return res.status(400).json({
        status: false,
        msg: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req?.body?.email)) {
      return res.status(400).json({
        status: false,
        msg: "invalid email format",
      });
    }

    // Validate role_ids
    const validRoles = await conn.roles.findOne({
      where: { id: req.body.role_id },
      transaction,
    });

    // Create user
    const result = await conn.users.create(req.body, { transaction });

    // Create user_roles entries
    const userRoles = {
      user_id: result.id,
      role_id: req.body.role_id,
    };
    await conn.user_roles.create(userRoles, { transaction });

    // Remove password from response
    // delete result.dataValues.password;

    // // Generate JWT token
    // const token = jwt.sign(
    //   {
    //     user: {
    //       id: result.id,
    //       name: result.name,
    //     },
    //   },
    //   SECRET
    // );

    await transaction.commit();
    res.status(200).json({
      status: true,
      data: {
        // token,
        user: {
          id: result.id,
          name: result.name,
        },
      },
      msg: "Registration successful",
    });
  } catch (error) {
    console.error("Error in register:", error);
    if (transaction) await transaction.rollback();
    res.status(500).json({ status: false, msg: "حدث خطأ ما" });
  }
};

exports.donorRegister = async (req, res, next) => {
  let transaction;
  try {
    console.log("Request body:", req.body);
    transaction = await sequelize.transaction();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req?.body?.password, salt);
    req.body.password_hash = hash;

    // Validate required fields
    if (!req?.body?.name || !req?.body?.email || !req?.body?.password) {
      return res.status(400).json({
        status: false,
        msg: "Please fill all required fields (name, email, password, role_ids as array)",
      });
    }

    // Check for existing user
    const existingUser = await conn.users.findOne({
      where: { email: req.body.email },
      transaction,
    });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        msg: "email already exists",
      });
    }

    // Validate phone
    if (req?.body?.phone && req?.body?.phone.length < 9) {
      return res.status(400).json({
        status: false,
        msg: "رقم الهاتف يجب أن يكون 9 أرقام على الأقل",
      });
    }

    // Validate password length
    if (req?.body?.password.length < 6) {
      return res.status(400).json({
        status: false,
        msg: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req?.body?.email)) {
      return res.status(400).json({
        status: false,
        msg: "invalid email format",
      });
    }

    // Validate role_ids
    const validRoles = await conn.roles.findOne({
      where: { code: "donor" },
      transaction,
    });

    // Create user
    const result = await conn.users.create(req.body, { transaction });

    // Create user_roles entries
    const userRoles = {
      user_id: result.id,
      role_id: validRoles.id,
    };
    await conn.user_roles.create(userRoles, { transaction });

    // ✅ إنشاء Access Token صالح لمدة 15 دقيقة
    const accessToken = jwt.sign(
      { id: result.id, name: result.name },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ إنشاء Refresh Token صالح لمدة 7 أيام
    const refreshToken = jwt.sign(
      { id: result.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ إرسال الـ Refresh Token في Cookie آمنة
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 7 أيام
    });

    await transaction.commit();
    res.status(200).json({
      status: true,
      data: {
        // token,
        user: {
          id: result.id,
          name: result.name,
        },
        accessToken,
      },
      msg: "Registration successful",
    });
  } catch (error) {
    console.error("Error in register:", error);
    if (transaction) await transaction.rollback();
    res.status(500).json({ status: false, msg: "حدث خطأ ما" });
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({
      status: false,
      msg: "يرجى ملء جميع الحقول المطلوبة",
    });
  }

  try {
    const existingUser = await conn.users.findOne({ where: { phone } });
    if (!existingUser) {
      return res.status(401).json({
        status: false,
        msg: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    const matchedPass = await bcrypt.compare(
      password,
      existingUser.password_hash
    );
    if (!matchedPass) {
      return res.status(401).json({
        status: false,
        msg: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    // ✅ إنشاء Access Token صالح لمدة 15 دقيقة
    const accessToken = jwt.sign(
      { id: existingUser.id, name: existingUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ إنشاء Refresh Token صالح لمدة 7 أيام
    const refreshToken = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ إرسال الـ Refresh Token في Cookie آمنة
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 7 أيام
    });

    // ✅ إرسال الـ Access Token للواجهة الأمامية
    res.status(200).json({
      status: true,
      data: {
        accessToken,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        },
      },
    });
  } catch (error) {
    console.error({ error });
    res.status(500).json({
      status: false,
      msg: "حدث خطأ أثناء تسجيل الدخول",
    });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(200).json({
      status: false,
      msg: "يرجى ملء جميع الحقول المطلوبة",
    });
  }

  try {
    const existingUser = await conn.users.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(200).json({
        status: false,
        msg: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    const matchedPass = await bcrypt.compare(
      password,
      existingUser.password_hash
    );
    if (!matchedPass) {
      return res.status(200).json({
        status: false,
        msg: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    // ✅ إنشاء Access Token صالح لمدة 15 دقيقة
    const accessToken = jwt.sign(
      { id: existingUser.id, name: existingUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ إنشاء Refresh Token صالح لمدة 7 أيام
    const refreshToken = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ إرسال الـ Refresh Token في Cookie آمنة
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 7 أيام
    });

    // ✅ إرسال الـ Access Token للواجهة الأمامية
    res.status(200).json({
      status: true,
      data: {
        accessToken,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        },
      },
    });
  } catch (error) {
    console.error({ error });
    res.status(500).json({
      status: false,
      msg: "حدث خطأ أثناء تسجيل الدخول",
    });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await conn.users.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, msg: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await conn.users.update(
      { otp_token: otp, expiresAt },
      { where: { email } }
    ); // Save OTP

    const templatePath = path.join(
      __dirname,
      "../../templates/opt-verify.html"
    );
    let html = fs.readFileSync(templatePath, "utf-8");

    // Replace variables in the template
    html = html.replace(/\{user_name\}/g, user.name);
    html = html.replace(/\{otp\}/g, otp);

    // Send the email
    await sendEmail(user.email, "Account Verification OTP", html);
    res.json({ status: true, msg: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, msg: "Error sending OTP" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await conn.users.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, msg: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await conn.users.update(
      { otp_token: otp, expiresAt },
      { where: { email } }
    );
    const templatePath = path.join(
      __dirname,
      "../../templates/opt-verify.html"
    );
    let html = fs.readFileSync(templatePath, "utf-8");

    // Replace variables in the template
    html = html.replace(/\{user_name\}/g, user.name);
    html = html.replace(/\{otp\}/g, otp);
    await sendEmail(user.email, "Account Verification OTP", html);

    res.json({ status: true, msg: "OTP resent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, msg: "Failed to resend OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ status: false, msg: "Please provide email and OTP" });
    }

    const record = await conn.users.findOne({
      where: { email, otp_token: otp },
    });

    if (!record) {
      return res.status(400).json({ status: false, msg: "Invalid OTP" });
    }

    if (new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({ status: false, msg: "OTP has expired" });
    }

    res.status(200).json({ status: true, msg: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "Error verifying OTP" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ status: false, msg: "Please provide all required fields" });
    }

    const record = await conn.users.findOne({
      where: { email, otp_token: otp },
    });

    if (!record) {
      return res.status(400).json({ status: false, msg: "Invalid OTP" });
    }

    if (new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({ status: false, msg: "OTP has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await conn.users.update({ password: hashedPassword }, { where: { email } });

    res
      .status(200)
      .json({ status: true, msg: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "Error updating password" });
  }
};

exports.search = async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { col, page, limit, search, role_id } = req.body;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (search) {
      whereClause[col] = { [Op.like]: `%${search}%` };
    }

    let include = [
      {
        model: conn.user_roles,
        as: "user_roles",
        where: {
          role_id,
        },
        include: ["role"],
        // Must match the 'as' alias from User.belongsToMany
      },
    ];

    const users = await conn.users.findAll({
      limit,
      offset,
      include,
      where: whereClause,
      transaction,
    });

    const total = await conn.users.count({
      include,
      where: whereClause,
      transaction,
    });

    await transaction.commit();
    res.status(200).json({
      status: true,
      data: users,
      tot: total,
      msg: null, // Removed error msg on success
    });
  } catch (error) {
    console.error("Error in search:", error);
    if (transaction) await transaction.rollback();
    res.status(500).json({ status: false, msg: "حدث خطأ ما في السيرفر" });
  }
};
exports.updateAdminPassword = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await conn.users.update(
      { password: hash },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();
    res.status(200).json({ status: true, msg: "تم تحديث كلمة المرور" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ status: false, msg: "حدث خطأ ما", error });
  }
};
exports.paginate = async (req, res, next) => {
  try {
    const offset = (req.body.page - 1) * req.body.limit;
    console.log("the offset", offset, "the limit is ", req.body.limit);
    const result = await conn.users.findAll({
      order: [["id", "DESC"]],
      offset: offset,
      include: [
        {
          model: conn.user_roles,
          as: "user_roles",
          include: ["role"],
        },
      ],

      limit: req.body.limit,
      subQuery: true,
    });
    const count = await conn.users.findAll();
    res.status(200).json({ status: true, data: result, tot: count.length });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      msg: `حدث خطأ ما في السيرفر`,
    });
  }
};

//@decs   Get All
//@route  GET
//@access Public
exports.getUsers = async (req, res, next) => {
  try {
    const result = await conn.users.findAll();
    res.status(200).json({ status: true, data: result });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

//@decs   Get All
//@route  GET
//@access Public
exports.getUsersById = async (req, res, next) => {
  try {
    const result = await conn.users.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: conn.conference_applicant_request,
          as: "conference_applicant_requests",
          include: ["status"],
        },
        {
          model: conn.research_communities,
          as: "research_communities",
          include: ["status", "category"],
        },
      ],
    });
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

exports.getUserProfileById = async (req, res, next) => {
  try {
    // Validate request parameter
    if (!req.params.id) {
      return res.status(400).json({
        status: false,
        msg: "معرف المستخدم مطلوب",
      });
    }

    const result = await conn.users.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: conn.conference_applicant_request,
          as: "conference_applicant_requests",
          include: {
            model: conn.research_status,
            as: "status",
            where: {
              code: "Published",
            },
          },
        },
        {
          model: conn.research_communities,
          as: "research_communities",
          include: [
            {
              model: conn.research_status,
              as: "status",
              where: {
                code: "Published",
              },
            },
            "category",
          ],
        },
      ],
    });

    // Handle case when user is not found
    if (!result) {
      return res.status(404).json({
        status: false,
        msg: "المستخدم غير موجود",
      });
    }

    // Create a copy of result to avoid modifying original data
    const userData = result.toJSON();

    // Remove sensitive information based on data_access
    delete userData.password;
    if (!userData.data_access) {
      delete userData.email;
      delete userData.phone;
    }

    return res.status(200).json({
      status: true,
      data: userData,
    });
  } catch (error) {
    // Use error instead of e for clarity
    console.error("Error in getUserProfileById:", error);

    return res.status(500).json({
      status: false,
      msg: "حدث خطأ في الخادم",
    });
  }
};

//@decs   Get All
//@route  Put
//@access Public

exports.updateUsers = async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    // Validate and extract data from req.body
    const { id } = req.params;
    const { name, email, phone, role_id, image } = req.body; // Assuming these are parsed from FormData

    // Validate user existence
    const user = await conn.users.findByPk(id, { transaction });
    if (!user) {
      return res.status(404).json({ status: false, msg: "المستخدم غير موجود" });
    }

    // Validate required fields
    if (!name || !email || !phone || !role_id) {
      return res.status(400).json({ status: false, msg: "جميع الحقول مطلوبة" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ status: false, msg: "صيغة البريد الإلكتروني غير صحيحة" });
    }

    // Validate role_id (single value for now)
    if (!Array.isArray(role_id)) {
      const role = await conn.roles.findByPk(role_id, { transaction });
      if (!role) {
        return res.status(400).json({ status: false, msg: "الدور غير موجود" });
      }
    } else {
      // Future-proof: Validate multiple role_ids if provided as array
      const roles = await conn.roles.findAll({
        where: { id: { [Op.in]: role_id } },
        transaction,
      });
      if (roles.length !== role_id.length) {
        return res
          .status(400)
          .json({ status: false, msg: "واحد أو أكثر من الأدوار غير موجودة" });
      }
    }

    // Update user details
    const [updatedRows] = await conn.users.update(
      { name, email, phone, image }, // Handle image if sent as base64 or file path
      { where: { id }, transaction }
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ status: false, msg: "لم يتم تحديث أي مستخدم" });
    }

    // Update user_roles (single role for now)
    // Delete existing roles to ensure only one role
    await conn.user_roles.destroy({
      where: { user_id: id },
      transaction,
    });

    // Insert the new role
    await conn.user_roles.create(
      {
        user_id: id,
        role_id: role_id, // Single value
      },
      { transaction }
    );

    await transaction.commit();
    res
      .status(200)
      .json({ status: true, msg: "تم تحديث المستخدم ودوره بنجاح" });
  } catch (error) {
    console.error("Error updating user:", error);
    if (transaction) await transaction.rollback();
    res.status(500).json({ status: false, msg: "حدث خطأ ما" });
  }
};
exports.updateUserProfile = async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    // Validate and extract data from req.body
    const { id } = req.params;
    const { name, email, phone } = req.body; // Assuming these are parsed from FormData

    // Validate user existence
    const user = await conn.users.findByPk(id, { transaction });
    if (!user) {
      return res.status(404).json({ status: false, msg: "المستخدم غير موجود" });
    }

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ status: false, msg: "جميع الحقول مطلوبة" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ status: false, msg: "صيغة البريد الإلكتروني غير صحيحة" });
    }

    // Update user details
    const [updatedRows] = await conn.users.update(
      { name, email, phone }, // Handle image if sent as base64 or file path
      { where: { id }, transaction }
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ status: false, msg: "لم يتم تحديث أي مستخدم" });
    }

    await transaction.commit();
    res.status(200).json({ status: true, msg: "تم تحديث المستخدم بنجاح" });
  } catch (error) {
    console.error("Error updating user:", error);
    if (transaction) await transaction.rollback();
    res.status(500).json({ status: false, msg: "حدث خطأ ما" });
  }
};
exports.updatePass = async (req, res) => {
  try {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        const updated_user = await conn.users.update(
          { password: hash },
          { where: { id: req.body.user_id } }
        );
        console.log({ updated_user });
        res.status(201).json({ status: true });
      });
    });
  } catch (error) {
    res.status(200).json({ status: false, msg: `حدث خطأ ما في السيرفر` });
  }
};

//@decs   Get All
//@route  Delete
//@access Public
exports.deleteUsers = async (req, res, next) => {
  try {
    const user = await conn.users.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (user?.image)
      fs.unlink(user.image, (err) => {
        if (err) console.log(err);
        else {
          console.log("\nDeleted file successfuly");

          // Get the files in current directory
          // after deletion
        }
      });
    await conn.users.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({
      status: true,
      msg: `data deleted successfully`,
    });
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};
