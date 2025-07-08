const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const fs = require("fs");
const { sendEmail } = require("../../utils/mail");
const path = require("path");
exports.search = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.body;

    // Validate inputs
    if (!page || !limit || page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid pagination parameters" });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Define searchable columns for each model
    const searchableColumns = {
      donations_common: ["amount", "status"],
      user: ["name", "email"],
      category: ["name_ar", "name_en"],
    };

    // Build where condition dynamically
    let whereCondition = {};
    if (search) {
      // Sanitize search input to prevent SQL injection
      const sanitizedSearch = search.replace(/[%_]/g, "\\$&");

      // Combine conditions for all searchable columns using OR
      whereCondition = {
        [Op.or]: [
          // donations_common fields
          ...searchableColumns.donations_common.map((col) =>
            col === "amount"
              ? { [col]: parseFloat(sanitizedSearch) || 0 } // Handle amount as numeric
              : { [col]: { [Op.like]: `%${sanitizedSearch}%` } }
          ),
          // user fields
          ...searchableColumns.user.map((col) => ({
            [`$user.${col}$`]: { [Op.like]: `%${sanitizedSearch}%` },
          })),
          // category fields
          ...searchableColumns.category.map((col) => ({
            [`$category.${col}$`]: { [Op.like]: `%${sanitizedSearch}%` },
          })),
        ],
      };
    }

    // Fetch paginated results
    const assets = await conn.donations_common.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: conn.users, as: "user", attributes: ["id", "name", "email"] },
        {
          model: conn.donation_categories,
          as: "category",
          attributes: ["id", "name_ar", "name_en"],
        },
        "case",
        "gift",
      ],
      where: whereCondition,
      order: [["createdAt", "DESC"]],
    });

    // Fetch total count
    const count = await conn.donations_common.count({
      include: [
        { model: conn.users, as: "user" },
        { model: conn.donation_categories, as: "category" },
      ],
      where: whereCondition,
    });

    res.status(200).json({
      status: true,
      data: assets,
      tot: count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

//@decs   Get All
//@route  GET
//@access Public
exports.getDonationCommon = async (req, res, next) => {
  try {
    const result = await conn.donations_common.findAll({
      include: ["user", "category"],
    });
    res.status(200).json({ status: true, data: result });
    // res.status(500).json({
    //   status: false,
    //   msg: `حدث خطأ ما في السيرفر`,
    // });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      msg: `حدث خطأ ما في السيرفر`,
    });
  }
};
exports.createDonationCommon = async (req, res, next) => {
  try {
    const result = await conn.donations_common.create(req.body);

    res.status(200).json({ status: true, data: result });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      msg: `حدث خطأ ما في السيرفر`,
    });
  }
};

exports.paginate = async (req, res, next) => {
  try {
    const offset = (req.body.page - 1) * req.body.limit;
    console.log("the offset", offset, "the limit is ", req.body.limit);
    const result = await conn.donations_common.findAll({
      order: [["id", "DESC"]],
      offset: offset,
      include: ["user", "category", "case", "gift"],

      limit: req.body.limit,
      subQuery: true,
    });
    const count = await conn.donations_common.findAll();
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
exports.getDonationCommonById = async (req, res, next) => {
  try {
    const result = await conn.donations_common.findOne({
      where: { id: req.params.id },
      include: ["user", "category"],
    });
    res.status(200).json({ status: true, data: result });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      status: false,
      msg: `حدث خطأ ما في السيرفر`,
    });
  }
};

//@decs   Get All
//@route  Put
//@access Public
exports.updateDonationCommon = async (req, res, next) => {
  try {
    const category = await conn.donations_common.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (req.body.image) {
      if (category?.image) {
        fs.unlink(category.image, (err) => {
          if (err) console.log(err);
          else {
            console.log("\nDeleted file successfuly");

            // Get the files in current directory
            // after deletion
          }
        });
      }
    }
    await conn.donations_common.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).json({ status: true, data: req.body });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      status: false,
      msg: `حدث خطأ ما في السيرفر`,
    });
  }
};

//@decs   Get All
//@route  Delete
//@access Public
exports.deleteDonationCommon = async (req, res, next) => {
  try {
    const category = await conn.donations_common.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (category?.image) {
      fs.unlink(category.image, (err) => {
        if (err) console.log(err);
        else {
          console.log("\nDeleted file successfuly");

          // Get the files in current directory
          // after deletion
        }
      });
    }

    await conn.donations_common.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ status: true, msg: `data deleted successfully` });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      msg: `حدث خطأ ما في السيرفر`,
    });
  }
};
