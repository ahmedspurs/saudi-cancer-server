const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op } = require("sequelize");

exports.getDashboardStats = async (req, res, next) => {
  try {
    // تحديد نطاق الأسبوع الحالي والأسبوع الماضي
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate);
    oneWeekAgo.setDate(currentDate.getDate() - 7);
    const twoWeeksAgo = new Date(currentDate);
    twoWeeksAgo.setDate(currentDate.getDate() - 14);

    // جلب بيانات الأسبوع الحالي
    const [
      currentUsers,
      currentDonations,
      currentPatientCases,
      currentPayments,
    ] = await Promise.all([
      // عدد المستخدمين (غير المسؤولين) لهذا الأسبوع
      conn.users.count({
        where: {
          role: { [Op.ne]: "admin" },
          createdAt: { [Op.gte]: oneWeekAgo },
        },
      }),
      // عدد التبرعات لهذا الأسبوع
      conn.donations_common.count({
        where: { createdAt: { [Op.gte]: oneWeekAgo } },
      }),
      // عدد حالات المرضى النشطة لهذا الأسبوع
      conn.cases.count({
        where: { is_active: 1, createdAt: { [Op.gte]: oneWeekAgo } },
      }),
      // عدد الدفعات الناجحة لهذا الأسبوع
      conn.payments.count({
        where: {
          payment_status: "success",
          createdAt: { [Op.gte]: oneWeekAgo },
        },
      }),
    ]);

    const [
      lastWeekUsers,
      lastWeekDonations,
      lastWeekPatientCases,
      lastWeekPayments,
    ] = await Promise.all([
      conn.users.count({
        where: {
          role: { [Op.ne]: "admin" },
          createdAt: { [Op.between]: [twoWeeksAgo, oneWeekAgo] },
        },
      }),
      conn.donations_common.count({
        where: { createdAt: { [Op.between]: [twoWeeksAgo, oneWeekAgo] } },
      }),
      conn.cases.count({
        where: {
          is_active: 1,
          createdAt: { [Op.between]: [twoWeeksAgo, oneWeekAgo] },
        },
      }),
      conn.payments.count({
        where: {
          payment_status: "success",
          createdAt: { [Op.between]: [twoWeeksAgo, oneWeekAgo] },
        },
      }),
    ]);

    // حساب النسب المئوية أو التغيرات
    const calculateChange = (current, last) => {
      if (last === 0) return current > 0 ? 100 : 0; // إذا كان الأسبوع الماضي صفر، النسبة 100% إذا كان هناك تغيير
      const change = ((current - last) / last) * 100;
      return Math.round(change * 10) / 10; // تقريب إلى رقم عشري واحد
    };

    const usersChange = calculateChange(currentUsers, lastWeekUsers);
    const donationsChange = calculateChange(
      currentDonations,
      lastWeekDonations
    );
    const patientCasesChange = calculateChange(
      currentPatientCases,
      lastWeekPatientCases
    );
    const paymentsChange = calculateChange(currentPayments, lastWeekPayments);

    // جلب الإجماليات الكلية (لعرض الأرقام الإجمالية في الويدجت)
    const [totalUsers, totalDonations, totalPatientCases, totalPayments] =
      await Promise.all([
        conn.users.count({ where: { role: { [Op.ne]: "admin" } } }),
        conn.donations_common.count(),
        conn.cases.count({ where: { is_active: 1 } }),
        conn.payments.count({ where: { payment_status: "success" } }),
      ]);

    res.status(200).json({
      status: true,
      data: {
        users: totalUsers,
        donations: totalDonations,
        patientCases: totalPatientCases,
        payments: totalPayments,
        changes: {
          users: { count: currentUsers, percentage: usersChange },
          donations: { count: currentDonations, percentage: donationsChange },
          patientCases: {
            count: currentPatientCases,
            percentage: patientCasesChange,
          },
          payments: { count: currentPayments, percentage: paymentsChange },
        },
      },
    });
  } catch (error) {
    console.error("خطأ في وحدة التحكم getDashboardStats:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

exports.getRecentDonations = async (req, res, next) => {
  try {
    const donations = await conn.donations_common.findAll({
      limit: 8,
      order: [["createdAt", "DESC"]],
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
    console.error("خطأ في وحدة التحكم getRecentDonations:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

exports.getRecentPatientCases = async (req, res, next) => {
  try {
    const patientCases = await conn.cases.findAll({
      limit: 8,
      order: [["createdAt", "DESC"]],
      where: { is_active: 1 },
      attributes: ["id", "title", "progress", "createdAt"],
    });

    res.status(200).json({
      status: true,
      data: patientCases,
    });
  } catch (error) {
    console.error("خطأ في وحدة التحكم getRecentPatientCases:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};

exports.getDonationChart = async (req, res, next) => {
  try {
    // تجميع التبرعات حسب الشهر لآخر 6 أشهر
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyDonations = await conn.donations_common.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
      ],
      where: {
        createdAt: { [Op.gte]: sixMonthsAgo },
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("MONTH", Sequelize.col("createdAt")), "ASC"]],
    });

    // إعداد بيانات المخطط (ملء الأشهر الناقصة بصفر)
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
      data: data,
    });
  } catch (error) {
    console.error("خطأ في وحدة التحكم getDonationChart:", error);
    res.status(500).json({
      status: false,
      msg: "حدث خطأ ما في السيرفر",
    });
  }
};
