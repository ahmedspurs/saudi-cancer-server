const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const fs = require("fs");
const { sendEmail } = require("../../utils/mail");
const path = require("path");
exports.search = async (req, res, next) => {
  var searchCol = req.body.col;
  var offset = (req.body.page - 1) * req.body.limit;
  var search = req.body.search;
  await conn.governance
    .findAll({
      limit: req.body.limit,
      offset: offset,

      where: {
        [searchCol]: {
          [Op.like]: "%" + search + "%",
        },
      },
    })
    .then(async function (assets) {
      var count = conn.governance.findAll();
      res.status(200).json({ status: true, data: assets, tot: count.length });
    })
    .catch(function (error) {
      console.log(error);
    });
};

exports.searchByType = async (req, res, next) => {
  try {
    // Validate and sanitize input
    const {
      col: searchCol,
      page = 1,
      limit = 10,
      search = "",
      category_id,
    } = req.body;

    // Validate required fields
    if (!searchCol || !category_id) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields: col and category_id are required",
      });
    }

    // Sanitize page and limit to ensure they are positive integers
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(parseInt(limit, 10), 100)); // Cap limit at 100
    const offset = (pageNum - 1) * limitNum;

    // Check if category exists
    const category = await conn.governance_categories.findOne({
      where: { id: category_id },
    });

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    // Perform search and count in parallel
    const [assets, totalCount] = await Promise.all([
      conn.governance.findAll({
        where: {
          [Op.and]: [
            { [searchCol]: { [Op.like]: `%${search}%` } },
            { category_id },
          ],
        },
        include: ["category"],
        limit: limitNum,
        offset,
      }),
      conn.governance.count({
        where: {
          [Op.and]: [
            { [searchCol]: { [Op.like]: `%${search}%` } },
            { category_id },
          ],
        },
      }),
    ]);

    // Return response
    res.status(200).json({
      status: true,
      data: assets,
      category,
      total: totalCount,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalCount / limitNum),
    });
  } catch (error) {
    console.error("Error in searchByType:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    next(error); // Pass error to Express error middleware
  }
};

//@decs   Get All
//@route  GET
//@access Public
exports.getGovernance = async (req, res, next) => {
  try {
    const result = await conn.governance.findAll({
      include: ["category"],
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
exports.createGovernance = async (req, res, next) => {
  try {
    const result = await conn.governance.create(req.body);

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
    const result = await conn.governance.findAll({
      order: [["id", "DESC"]],
      offset: offset,
      include: ["category"],

      limit: req.body.limit,
      subQuery: true,
    });
    const count = await conn.governance.findAll();
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
exports.getGovernanceById = async (req, res, next) => {
  try {
    const result = await conn.governance.findOne({
      where: { id: req.params.id },
      include: ["category"],
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
exports.updateGovernance = async (req, res, next) => {
  try {
    const category = await conn.governance.findOne({
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
    await conn.governance.update(req.body, {
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
exports.deleteGovernance = async (req, res, next) => {
  try {
    const category = await conn.governance.findOne({
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

    await conn.governance.destroy({
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
