// controllers/reports.js
const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op } = require("sequelize");

// جلب قائمة التبرعات مع الفلاتر
exports.getDonations = async (req, res) => {
  try {
    const { startDate, endDate, category, status } = req.query;

    // بناء شروط التصفية
    const donationWhere = {};
    if (startDate) donationWhere.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate)
      donationWhere.createdAt = {
        ...donationWhere.createdAt,
        [Op.lte]: new Date(endDate),
      };
    if (category) donationWhere.category_id = category;

    const paymentWhere = status ? { payment_status: status } : {};

    // استرجاع التبرعات
    const donations = await conn.donations_common.findAll({
      where: donationWhere,
      include: [
        {
          model: conn.donation_categories,
          as: "category",
          attributes: ["name_ar"],
        },
        {
          model: conn.payments,
          as: "payment",
          attributes: ["payment_status"],
          where: paymentWhere,
          required: status ? true : false,
        },
        {
          model: conn.users,
          as: "user",
          attributes: ["name"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 100,
    });

    res.status(200).json({
      status: true,
      data: donations,
    });
  } catch (error) {
    console.error("خطأ في وحدة التحكم getDonations:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

// جلب توزيع التبرعات حسب الفئة
exports.getDonationsByCategory = async (req, res) => {
  try {
    const { startDate, endDate, category, status } = req.query;

    // بناء شروط التصفية
    const donationWhere = {};
    if (startDate) donationWhere.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate)
      donationWhere.createdAt = {
        ...donationWhere.createdAt,
        [Op.lte]: new Date(endDate),
      };
    if (category) donationWhere.category_id = category;

    const paymentWhere = status ? { payment_status: status } : {};

    // تجميع التبرعات حسب الفئة
    const donations = await conn.donations_common.findAll({
      attributes: [
        [Sequelize.col("category.id"), "category_id"], // إدراج category_id صراحة
        [
          Sequelize.fn("SUM", Sequelize.col("donations_common.amount")),
          "total",
        ], // تجميع المبلغ
      ],
      include: [
        {
          model: conn.donation_categories,
          as: "category",
          attributes: ["name_ar"],
          required: true, // التأكد من وجود فئة
        },
        {
          model: conn.payments,
          as: "payment",
          attributes: [],
          where: paymentWhere,
          required: status ? true : false,
        },
      ],
      where: donationWhere,
      group: ["category.id", "category.name_ar"], // إدراج جميع الأعمدة غير المجمعة
      raw: true, // استخدام البيانات الخام لتجنب التعقيدات
    });

    const labels = donations.map((d) => d["category.name_ar"] || "غير محدد");
    const values = donations.map((d) => parseFloat(d.total));

    res.status(200).json({
      status: true,
      data: { labels, values },
    });
  } catch (error) {
    console.error("خطأ في وحدة التحكم getDonationsByCategory:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

// جلب اتجاهات التبرعات عبر الوقت
exports.getDonationsTimeline = async (req, res) => {
  try {
    const { startDate, endDate, category, status } = req.query;

    // بناء شروط التصفية
    const donationWhere = {};
    if (startDate) donationWhere.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate)
      donationWhere.createdAt = {
        ...donationWhere.createdAt,
        [Op.lte]: new Date(endDate),
      };
    if (category) donationWhere.category_id = category;

    const paymentWhere = status ? { payment_status: status } : {};

    // تحديد نطاق الزمن الافتراضي
    let start = startDate
      ? new Date(startDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 6));
    let end = endDate ? new Date(endDate) : new Date();

    // حساب عدد الأيام بين التواريخ
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const groupBy = daysDiff <= 30 ? "DAY" : daysDiff <= 90 ? "WEEK" : "MONTH";
    const format =
      daysDiff <= 30 ? "%Y-%m-%d" : daysDiff <= 90 ? "%Y-%u" : "%Y-%m";

    // تجميع التبرعات حسب الزمن
    const timeline = await conn.donations_common.findAll({
      attributes: [
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("donations_common.createdAt"),
            format
          ),
          "period",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("donations_common.amount")),
          "total",
        ],
      ],
      include: [
        {
          model: conn.payments,
          as: "payments",
          attributes: [],
          where: paymentWhere,
          required: status ? true : false,
        },
      ],
      where: donationWhere,
      group: [
        Sequelize.fn(
          "DATE_FORMAT",
          Sequelize.col("donations_common.createdAt"),
          format
        ),
      ],
      order: [
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("donations_common.createdAt"),
            format
          ),
          "ASC",
        ],
      ],
      raw: true,
    });

    // إنشاء التصنيفات (labels) والقيم (values)
    const labels = [];
    const values = [];
    let current = new Date(start);

    if (groupBy === "DAY") {
      while (current <= end) {
        const period = current.toISOString().split("T")[0];
        labels.push(period);
        const found = timeline.find((t) => t.period === period);
        values.push(found ? parseFloat(found.total) : 0);
        current.setDate(current.getDate() + 1);
      }
    } else if (groupBy === "WEEK") {
      while (current <= end) {
        const year = current.getFullYear();
        const week = Math.ceil((current.getDate() - current.getDay() + 1) / 7);
        const period = `${year}-${week}`;
        labels.push(`الأسبوع ${week} ${year}`);
        const found = timeline.find((t) => t.period === period);
        values.push(found ? parseFloat(found.total) : 0);
        current.setDate(current.getDate() + 7);
      }
    } else {
      while (current <= end) {
        const period = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, "0")}`;
        labels.push(period);
        const found = timeline.find((t) => t.period === period);
        values.push(found ? parseFloat(found.total) : 0);
        current.setMonth(current.getMonth() + 1);
      }
    }

    res.status(200).json({
      status: true,
      data: { labels, values },
    });
  } catch (error) {
    console.error("خطأ في وحدة التحكم getDonationsTimeline:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};
exports.getCases = async (req, res) => {
  try {
    const { startDate, endDate, status, progress } = req.query;

    // بناء شروط التصفية
    const where = {};
    if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate)
      where.createdAt = { ...where.createdAt, [Op.lte]: new Date(endDate) };
    if (status !== null && status !== undefined)
      where.is_active = parseInt(status);
    if (progress) {
      const [min, max] = progress.split("-").map(Number);
      where.progress = { [Op.between]: [min, max] };
    }

    // استرجاع الحالات
    const cases = await conn.patients_cases.findAll({
      attributes: ["id", "title", "progress", "is_active", "createdAt"],
      include: [
        {
          model: conn.donations_common,
          attributes: [],
          where: { payment_id: { [Op.ne]: null } }, // التأكد من وجود دفع مرتبط
          include: [
            {
              model: conn.payments,
              attributes: [],
              where: { payment_status: "success" }, // التبرعات الناجحة فقط
            },
          ],
          required: false,
        },
      ],
      where,
      group: ["patients_cases.id"], // تجميع حسب معرف الحالة
      having: Sequelize.literal("1=1"), // لتجنب أخطاء GROUP BY
      subQuery: false, // تحسين الأداء
      raw: true, // استخدام البيانات الخام
      include: [
        {
          model: conn.donations_common,
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("donations_common.amount")),
              "total_donations",
            ],
          ],
          include: [
            {
              model: conn.payments,
              attributes: [],
              where: { payment_status: "success" },
            },
          ],
          required: false,
        },
      ],
    });

    res.status(200).json({
      status: true,
      data: cases.map((c) => ({
        ...c,
        total_donations: parseFloat(c.total_donations) || 0,
      })),
    });
  } catch (error) {
    console.error("خطأ في وحدة التحكم getCases:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

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

// Get cases
exports.getCases = async (req, res) => {
  try {
    const { startDate, endDate, status, progress } = req.query;

    // Build where clause
    const where = {};
    if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate)
      where.createdAt = { ...where.createdAt, [Op.lte]: new Date(endDate) };
    if (status !== null && status !== undefined) where.status = status;
    if (progress) {
      const [min, max] = progress.split("-").map(Number);
      where.progress = { [Op.between]: [min, max] };
    }

    const cases = await conn.cases.findAll({
      attributes: [
        "id",
        "title",
        "progress",
        "status",
        "createdAt",
        [
          Sequelize.fn("SUM", Sequelize.col("donations_commons.amount")),
          "total_donations",
        ],
      ],
      include: [
        {
          model: conn.donations_common,
          as: "donations_commons",
          attributes: [],
          required: false, // Left join to include cases with no donations
        },
      ],
      where,
      group: ["cases.id"],
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    // Convert total_donations to number
    cases.forEach((c) => {
      c.total_donations = c.total_donations ? parseFloat(c.total_donations) : 0;
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

// Get cases by status (pie chart)
exports.getCasesByStatus = async (req, res) => {
  try {
    const { startDate, endDate, progress } = req.query;

    // Build where clause
    const where = {};
    if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate)
      where.createdAt = { ...where.createdAt, [Op.lte]: new Date(endDate) };
    if (progress) {
      const [min, max] = progress.split("-").map(Number);
      where.progress = { [Op.between]: [min, max] };
    }

    // Group cases by status
    const casesByStatus = await conn.cases.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("cases.id")), "count"],
      ],
      where,
      group: ["status"],
      raw: true,
    });

    // Convert to [open, completed]
    const data = [0, 0]; // [open, completed]
    casesByStatus.forEach((c) => {
      if (c.status === "open") data[0] = parseInt(c.count);
      else if (c.status === "completed") data[1] = parseInt(c.count);
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

// Get cases timeline (line chart)
exports.getCasesTimeline = async (req, res) => {
  try {
    const { startDate, endDate, status, progress } = req.query;

    // Build where clause
    const where = {};
    if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate)
      where.createdAt = { ...where.createdAt, [Op.lte]: new Date(endDate) };
    if (status !== null && status !== undefined) where.status = status;
    if (progress) {
      const [min, max] = progress.split("-").map(Number);
      where.progress = { [Op.between]: [min, max] };
    }

    // Determine time range and grouping
    let start = startDate
      ? new Date(startDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 6));
    let end = endDate ? new Date(endDate) : new Date();

    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const groupBy = daysDiff <= 30 ? "DAY" : daysDiff <= 90 ? "WEEK" : "MONTH";
    const format =
      daysDiff <= 30 ? "%Y-%m-%d" : daysDiff <= 90 ? "%Y-%u" : "%Y-%m";

    // Group cases by time period
    const timeline = await conn.cases.findAll({
      attributes: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("cases.createdAt"), format),
          "period",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("cases.id")), "count"],
      ],
      where,
      group: [
        Sequelize.fn("DATE_FORMAT", Sequelize.col("cases.createdAt"), format),
      ],
      order: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("cases.createdAt"), format),
          "ASC",
        ],
      ],
      raw: true,
    });

    const labels = [];
    const values = [];
    let current = new Date(start);

    if (groupBy === "DAY") {
      while (current <= end) {
        const period = current.toISOString().split("T")[0];
        labels.push(period);
        const found = timeline.find((t) => t.period === period);
        values.push(found ? parseInt(found.count) : 0);
        current.setDate(current.getDate() + 1);
      }
    } else if (groupBy === "WEEK") {
      while (current <= end) {
        const year = current.getFullYear();
        const week = Math.ceil((current.getDate() - current.getDay() + 1) / 7);
        const period = `${year}-${week}`;
        labels.push(`الأسبوع ${week} ${year}`);
        const found = timeline.find((t) => t.period === period);
        values.push(found ? parseInt(found.count) : 0);
        current.setDate(current.getDate() + 7);
      }
    } else {
      while (current <= end) {
        const period = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, "0")}`;
        labels.push(period);
        const found = timeline.find((t) => t.period === period);
        values.push(found ? parseInt(found.count) : 0);
        current.setMonth(current.getMonth() + 1);
      }
    }

    res.status(200).json({
      status: true,
      data: { labels, values },
    });
  } catch (error) {
    console.error("Error in getCasesTimeline:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

// Get payments
exports.getPayments = async (req, res) => {
  try {
    const { startDate, endDate, status, amount } = req.query;

    // Validate model
    if (!conn.payments || !conn.donations_common || !conn.cases) {
      throw new Error(
        "Payments, donations_common, or cases model is not defined"
      );
    }

    // Build where clause
    const where = {};
    if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate)
      where.createdAt = { ...where.createdAt, [Op.lte]: new Date(endDate) };
    if (status !== null && status !== undefined) where.payment_status = status;
    if (amount) {
      const [min, max] = amount.split("-").map(Number);
      where.amount = { [Op.between]: [min, max] };
    }

    const payments = await conn.payments.findAll({
      attributes: [
        "id",
        "amount",
        "payment_status",
        "createdAt",
        [Sequelize.col("donation.case.title"), "case_title"],
      ],
      include: [
        {
          model: conn.donations_common,
          as: "donation",
          attributes: [],
          required: false,
          include: [
            {
              model: conn.cases,
              as: "case",
              attributes: [],
              required: false,
            },
          ],
        },
      ],
      where,
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    res.status(200).json({
      status: true,
      data: payments,
    });
  } catch (error) {
    console.error("Error in getPayments:", error);
    res.status(500).json({
      status: false,
      msg: `حدث خطأ ما في السيرفر: ${error.message}`,
    });
  }
};

// Get payments by status (pie chart)
exports.getPaymentsByStatus = async (req, res) => {
  try {
    const { startDate, endDate, amount } = req.query;

    // Build where clause
    const where = {};
    if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate)
      where.createdAt = { ...where.createdAt, [Op.lte]: new Date(endDate) };
    if (amount) {
      const [min, max] = amount.split("-").map(Number);
      where.amount = { [Op.between]: [min, max] };
    }

    // Group payments by status
    const paymentsByStatus = await conn.payments.findAll({
      attributes: [
        "payment_status",
        [Sequelize.fn("COUNT", Sequelize.col("payments.id")), "count"],
      ],
      where,
      group: ["payment_status"],
      raw: true,
    });

    // Convert to [success, failed, pending]
    const data = [0, 0, 0]; // [success, failed, pending]
    paymentsByStatus.forEach((p) => {
      if (p.payment_status === "success") data[0] = parseInt(p.count);
      else if (p.payment_status === "failed") data[1] = parseInt(p.count);
      else if (p.payment_status === "pending") data[2] = parseInt(p.count);
    });

    res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    console.error("Error in getPaymentsByStatus:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

// Get payments timeline (line chart)
exports.getPaymentsTimeline = async (req, res) => {
  try {
    const { startDate, endDate, status, amount } = req.query;

    // Build where clause
    const where = {};
    if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate)
      where.createdAt = { ...where.createdAt, [Op.lte]: new Date(endDate) };
    if (status !== null && status !== undefined) where.payment_status = status;
    if (amount) {
      const [min, max] = amount.split("-").map(Number);
      where.amount = { [Op.between]: [min, max] };
    }

    // Determine time range and grouping
    let start = startDate
      ? new Date(startDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 6));
    let end = endDate ? new Date(endDate) : new Date();

    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const groupBy = daysDiff <= 30 ? "DAY" : daysDiff <= 90 ? "WEEK" : "MONTH";
    const format =
      daysDiff <= 30 ? "%Y-%m-%d" : daysDiff <= 90 ? "%Y-%u" : "%Y-%m";

    // Group payments by time period
    const timeline = await conn.payments.findAll({
      attributes: [
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("payments.createdAt"),
            format
          ),
          "period",
        ],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total_amount"],
      ],
      where,
      group: [
        Sequelize.fn(
          "DATE_FORMAT",
          Sequelize.col("payments.createdAt"),
          format
        ),
      ],
      order: [
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("payments.createdAt"),
            format
          ),
          "ASC",
        ],
      ],
      raw: true,
    });

    const labels = [];
    const values = [];
    let current = new Date(start);

    if (groupBy === "DAY") {
      while (current <= end) {
        const period = current.toISOString().split("T")[0];
        labels.push(period);
        const found = timeline.find((t) => t.period === period);
        values.push(found ? parseFloat(found.total_amount) : 0);
        current.setDate(current.getDate() + 1);
      }
    } else if (groupBy === "WEEK") {
      while (current <= end) {
        const year = current.getFullYear();
        const week = Math.ceil((current.getDate() - current.getDay() + 1) / 7);
        const period = `${year}-${week}`;
        labels.push(`الأسبوع ${week} ${year}`);
        const found = timeline.find((t) => t.period === period);
        values.push(found ? parseFloat(found.total_amount) : 0);
        current.setDate(current.getDate() + 7);
      }
    } else {
      while (current <= end) {
        const period = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, "0")}`;
        labels.push(period);
        const found = timeline.find((t) => t.period === period);
        values.push(found ? parseFloat(found.total_amount) : 0);
        current.setMonth(current.getMonth() + 1);
      }
    }

    res.status(200).json({
      status: true,
      data: { labels, values },
    });
  } catch (error) {
    console.error("Error in getPaymentsTimeline:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};
