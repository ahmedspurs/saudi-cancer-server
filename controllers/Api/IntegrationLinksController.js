const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const fs = require("fs");
const { sendEmail } = require("../../utils/mail");
const path = require("path");
exports.search = async (req, res, next) => {
  var searchCol = req.body.col;
  var offset = (req.body.page - 1) * req.body.limit;
  var search = req.body.search;
  await conn.integration_links
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
      var count = conn.integration_links.findAll();
      res.status(200).json({ status: true, data: assets, tot: count.length });
    })
    .catch(function (error) {
      console.log(error);
    });
};

//@decs   Get All
//@route  GET
//@access Public
exports.getIntegrationLinks = async (req, res, next) => {
  try {
    const result = await conn.integration_links.findAll();
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
exports.createIntegrationLinks = async (req, res, next) => {
  try {
    const result = await conn.integration_links.create(req.body);

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
    const result = await conn.integration_links.findAll({
      order: [["id", "DESC"]],
      offset: offset,

      limit: req.body.limit,
      subQuery: true,
    });
    const count = await conn.integration_links.findAll();
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
exports.getIntegrationLinksById = async (req, res, next) => {
  try {
    const result = await conn.integration_links.findOne({
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
exports.updateIntegrationLinks = async (req, res, next) => {
  try {
    const category = await conn.integration_links.findOne({
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
    await conn.integration_links.update(req.body, {
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
exports.deleteIntegrationLinks = async (req, res, next) => {
  try {
    const category = await conn.integration_links.findOne({
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

    await conn.integration_links.destroy({
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
