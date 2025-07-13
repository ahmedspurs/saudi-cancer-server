const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const fs = require("fs");
const { sendEmail } = require("../../utils/mail");
const path = require("path");
exports.search = async (req, res, next) => {
  var searchCol = req.body.col;
  var offset = (req.body.page - 1) * req.body.limit;
  var search = req.body.search;
  await conn.cases
    .findAll({
      limit: req.body.limit,
      order: [["id", "DESC"]], // Default sorting by id DESC
      offset: offset,

      where: {
        [searchCol]: {
          [Op.like]: "%" + search + "%",
        },
      },
    })
    .then(async function (assets) {
      var count = conn.cases.findAll();
      res.status(200).json({ status: true, data: assets, tot: count.length });
    })
    .catch(function (error) {
      console.log(error);
    });
};

exports.byType = async (req, res, next) => {
  try {
    const { col, search, type, page, limit } = req.body;

    // Validate inputs
    if (!col || !page || !limit) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields: col, search, page, or limit",
      });
    }

    const offset = (page - 1) * limit;

    // Build the where clause
    const where = {
      [Op.and]: [
        {
          [col]: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          type,
        },
      ],
    };

    // Add type filter if provided

    // Fetch paginated results
    const assets = await conn.cases.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]], // Default sorting by id DESC
    });

    // Fetch total count with the same filters
    const count = await conn.cases.count({ where });

    // Return response
    res.status(200).json({
      status: true,
      data: assets,
      tot: count,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.paginateDashboard = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category_id,
      user_id,
    } = req.body;

    // Validate inputs
    if (!Number.isInteger(page) || page < 1) {
      return res
        .status(400)
        .json({ status: false, message: "Page must be a positive integer" });
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res
        .status(400)
        .json({ status: false, message: "Limit must be between 1 and 100" });
    }

    const offset = (page - 1) * limit;
    const where = {};

    // Search across title and description
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter by category_id if provided
    if (category_id) {
      where.type = category_id;
    }

    // Filter by user_id if provided (for "My Cases")
    if (user_id) {
      where.user_id = user_id;
    }

    // Fetch paginated cases
    const cases = await conn.cases.findAll({
      where,
      limit,
      offset,
      order: [["id", "DESC"]], // Default sorting by id DESC
      include: ["user", "category", "donation_cases"],
    });

    // Get total count for pagination
    const total = await conn.cases.count({ where });

    res.status(200).json({
      status: true,
      data: cases,
      tot: total,
    });
  } catch (error) {
    console.error("Error in paginate:", error);
    res.status(500).json({ status: false, message: "Failed to fetch cases" });
  }
};

//@decs   Get All
//@route  GET
//@access Public
exports.getCases = async (req, res, next) => {
  try {
    const result = await conn.cases.findAll();
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
exports.createCases = async (req, res, next) => {
  try {
    req.body.user_id = req?.user?.id;
    const result = await conn.cases.create(req.body);

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
    const result = await conn.cases.findAll({
      order: [["id", "DESC"]],
      offset: offset,
      inclue: ["user", "category", "donation_cases"],
      limit: req.body.limit,
      subQuery: true,
    });
    const count = await conn.cases.findAll();
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
exports.getCasesById = async (req, res, next) => {
  try {
    const result = await conn.cases.findOne({
      where: { id: req.params.id },
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
exports.updateCases = async (req, res, next) => {
  try {
    const category = await conn.cases.findOne({
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
    await conn.cases.update(req.body, {
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
exports.deleteCases = async (req, res, next) => {
  try {
    const category = await conn.cases.findOne({
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

    await conn.cases.destroy({
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
