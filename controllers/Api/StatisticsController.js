const { Op, Sequelize } = require("sequelize");
const { conn, sequelize } = require("../../db/conn");

// Helper function for time range
const getTimeRange = (time) => {
  const currentDate = new Date();
  let startDate = null;

  switch (time) {
    case "7_days":
      startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
      break;
    case "30_days":
      startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
      break;
    case "90_days":
      startDate = new Date(currentDate.setDate(currentDate.getDate() - 90));
      break;
    case "all_time":
    default:
      startDate = null;
      break;
  }

  return startDate ? { createdAt: { [Op.gte]: startDate } } : {};
};

// Get summary metrics
exports.getSummary = async (req, res) => {
  try {
    const { time, category } = req.query;
    const timeFilter = getTimeRange(time);
    const categoryFilter = category ? { category_id: category } : {};

    const [totalDonations, cases, successfulPayments, averageDonation] =
      await Promise.all([
        // Total donations
        conn.donations_common.sum("amount", {
          where: { ...timeFilter, ...categoryFilter },
        }) || 0,
        // Number of cases
        conn.cases.count({
          where: { is_active: 1, ...timeFilter },
        }),
        // Number of successful payments
        conn.payments.count({
          where: { payment_status: "success", ...timeFilter },
        }),
        // Average donation amount
        conn.donations_common
          .findOne({
            attributes: [[Sequelize.fn("AVG", Sequelize.col("amount")), "avg"]],
            where: { ...timeFilter, ...categoryFilter },
          })
          .then((result) =>
            result ? parseFloat(result.dataValues.avg).toFixed(2) : 0
          ),
      ]);

    res.status(200).json({
      status: true,
      data: {
        totalDonations,
        cases,
        successfulPayments,
        averageDonation,
      },
    });
  } catch (error) {
    console.error("Error in getSummary:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

// Get donations by category (pie chart)
exports.getDonationsByCategory = async (req, res) => {
  try {
    const { time, category } = req.query;
    const timeFilter = getTimeRange(time);
    const categoryFilter = category ? { category_id: category } : {};

    const donations = await conn.donations_common.findAll({
      attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "total"]],
      include: [
        {
          model: conn.donation_categories,
          as: "category",
          attributes: ["name_ar"],
        },
      ],
      where: { ...timeFilter, ...categoryFilter },
      group: ["category_id"],
    });

    const labels = donations.map((d) => d?.category?.name_ar);
    const values = donations.map((d) => parseFloat(d.dataValues.total));

    res.status(200).json({
      status: true,
      data: { labels, values },
    });
  } catch (error) {
    console.error("Error in getDonationsByCategory:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

// Get monthly donations (line chart)
exports.getMonthlyDonations = async (req, res) => {
  try {
    const { time, category } = req.query;
    const timeFilter = getTimeRange(time);
    const categoryFilter = category ? { category_id: category } : {};

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyDonations = await conn.donations_common.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
      ],
      where: {
        ...timeFilter,
        ...categoryFilter,
        createdAt: { [Op.gte]: sixMonthsAgo },
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("MONTH", Sequelize.col("createdAt")), "ASC"]],
    });

    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return date.getMonth() + 1;
    });
    const data = months.map((month) => {
      const found = monthlyDonations.find(
        (d) => parseInt(d.dataValues.month) === month
      );
      return found ? parseFloat(found.dataValues.totalAmount) : 0;
    });

    res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    console.error("Error in getMonthlyDonations:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

// Get cases by status (bar chart)
exports.getCasesByStatus = async (req, res) => {
  try {
    const { time } = req.query;
    const timeFilter = getTimeRange(time);

    const casesByStatus = await conn.cases.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      where: { ...timeFilter },
      group: ["status"],
    });

    const data = [0, 0]; // [open, completed]
    casesByStatus.forEach((c) => {
      if (c.status === "open") data[0] = parseInt(c.dataValues.count);
      else if (c.status === "completed") data[1] = parseInt(c.dataValues.count);
    });

    res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    console.error("Error in getCasesByStatus:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

// Get top donations
exports.getTopDonations = async (req, res) => {
  try {
    const { time, category } = req.query;
    const timeFilter = getTimeRange(time);
    const categoryFilter = category ? { category_id: category } : {};

    const donations = await conn.donations_common.findAll({
      limit: 5,
      order: [["amount", "DESC"]],
      where: { ...timeFilter, ...categoryFilter },
      include: [
        {
          model: conn.donation_categories,
          as: "category",
          attributes: ["name_ar"],
        },
      ],
    });

    res.status(200).json({
      status: true,
      data: donations,
    });
  } catch (error) {
    console.error("Error in getTopDonations:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

// Get cases
exports.getCases = async (req, res) => {
  try {
    const { time } = req.query;
    const timeFilter = getTimeRange(time);

    const cases = await conn.cases.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      where: { ...timeFilter },
      attributes: ["id", "title", "progress", "status", "createdAt"],
    });

    res.status(200).json({
      status: true,
      data: cases,
    });
  } catch (error) {
    console.error("Error in getCases:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

// Get donation categories
exports.getCategories = async (req, res) => {
  try {
    const result = await conn.donation_categories.findAll();
    res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};
