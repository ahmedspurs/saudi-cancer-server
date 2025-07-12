const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const fs = require("fs");
const { sendEmail } = require("../../utils/mail");
const path = require("path");
const crypto = require("crypto");
const SendSMS = require("../../services/sms");
const smsService = new SendSMS();

exports.search = async (req, res, next) => {
  var searchCol = req.body.col;
  var offset = (req.body.page - 1) * req.body.limit;
  var search = req.body.search;
  await conn.payments
    .findAll({
      limit: req.body.limit,
      offset: offset,
      include: [
        {
          model: conn.donations_common,
          as: "donation",
          include: ["case", "user"],
        },
        "payment_method",
      ],
      where: {
        [searchCol]: {
          [Op.like]: "%" + search + "%",
        },
      },
    })
    .then(async function (assets) {
      var count = conn.payments.findAll();
      res.status(200).json({ status: true, data: assets, tot: count.length });
    })
    .catch(function (error) {
      console.log(error);
    });
};

//@decs   Get All
//@route  GET
//@access Public
exports.getPayments = async (req, res, next) => {
  try {
    const result = await conn.payments.findAll();
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
const createDonationCases = async (daonations) => {
  if (daonations.length > 0) {
  }
};

exports.checkout = async (req, res, next) => {
  let transaction;
  try {
    const { donations = [], gifts = [] } = req.body;
    const gift_category = await conn.donation_categories.findOne({
      where: {
        name_en: "Gifts",
      },
    });
    // Validate input
    if (!donations.length && !gifts.length) {
      return res.status(400).json({
        status: false,
        msg: "يجب تحديد تبرع أو هدية على الأقل",
      });
    }

    transaction = await sequelize.transaction();

    // Create payment record
    if (req.body.status == "paid") {
      req.body.payment_status = "success";
    } else if (req.body.status == "failed") {
      req.body.payment_status = "failed";
    } else {
      req.body.payment_status = "pending";
    }

    const payment = await conn.payments.create(req.body, { transaction });

    // Process donations
    if (donations.length) {
      for (const donation of donations) {
        // Validate donation data
        if (!donation.id || !donation.amount) {
          throw new Error("Invalid donation data");
        }

        const common = await conn.donations_common.create(
          {
            payment_id: payment.id,
            case_id: donation.id,
            amount: donation.amount,
            qty: donation.qty,
            category_id: donation.category_id,
            user_id: req?.user?.id ? req.user.id : null,
            user_name: req?.user?.id ? null : req.body.user?.name,
            user_phone: req?.user?.id ? null : req.body.user?.phone,
            status: req.body?.status,
          },
          { transaction }
        );
        await conn.donation_cases.create(
          {
            case_id: donation.id,
            amount: donation.amount,
            donation_id: common.id,
          },
          { transaction }
        );
      }
    }

    // Process gifts
    if (gifts.length) {
      for (const gift of gifts) {
        // Validate gift data
        if (!gift.amount || !gift.receiver_name || !gift.receiver_phone) {
          throw new Error("Invalid gift data");
        }

        let sms_send;
        if (req.body.status == "paid") {
          const message = gift?.message
            ? gift?.message
            : `تم التبرع لجمعية السرطان بالمنطقة الشرقية نيابة عن ${gift?.receiver_name}، جعله الله شفاءً وأجرًا.`;
          sms_send = await smsService.sendSMSMessage(
            message,
            gift?.receiver_phone
          );
          if (!sms_send) {
            throw new Error("sms not sent");
          }
        }
        const gift_result = await conn.gift_donations.create(
          { ...gift, sms_sent: sms_send ? 1 : 0 },
          { transaction }
        );
        const common = await conn.donations_common.create(
          {
            payment_id: payment.id,
            gift_id: gift_result.id, // Fixed typo: gift_if → gift_id
            amount: gift.amount,
            category_id: gift.category_id,
            user_id: req?.user?.id ? req.user.id : null,
            user_name: req?.user?.id ? null : req.body.user?.name,
            user_phone: req?.user?.id ? null : req.body.user?.phone,
            status: req.body?.status,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    return res.status(200).json({
      status: true,
      msg: "تم إنشاء الدفع بنجاح",
      data: { payment_id: payment.id },
    });
  } catch (error) {
    if (transaction) await transaction.rollback();

    console.error("Checkout error:", error);
    return res.status(500).json({
      status: false,
      msg: "حدث خطأ في الخادم",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.paymentWebhook = async (req, res, next) => {
  let transaction;
  try {
    const signature = req.body.secret_token;
    const webhookSecret = process.env.MOYASAR_WEBHOOK_SECRET; // Set in .env

    if (!verifyMoyasarSignature(req.body, signature, webhookSecret)) {
      return res.status(400).json({
        status: false,
        msg: "توقيع الويب هوك غير صالح",
      });
    }

    // 2. Parse webhook payload
    const event = req.body;
    const paymentId = req.body.data.id;
    const { status, type: eventType } = event;

    // 3. Validate required fields
    if (!paymentId || !eventType) {
      return res.status(400).json({
        status: false,
        msg: "بيانات الويب هوك غير مكتملة",
      });
    }

    // 4. Handle supported Moyasar events
    const supportedEvents = [
      "payment_paid",
      "payment_failed",
      "payment_authorized",
      "payment_captured",
      "payment_refunded",
      "payment_voided",
      "payment_abandoned",
      "payment_verified",
    ];

    if (!supportedEvents.includes(eventType)) {
      return res.status(200).json({
        status: true,
        msg: "نوع الحدث غير مدعوم، تم استلامه",
      });
    }

    transaction = await sequelize.transaction();

    // 6. Map Moyasar status to your database status
    const statusMap = {
      payment_paid: "success",
      payment_failed: "failed",
      payment_canceled: "failed",
    };

    const newStatus = statusMap[eventType];
    console.log({ newStatus });

    const updatedPayment = await conn.payments.update(
      { payment_status: newStatus },
      {
        where: {
          payment_id: paymentId,
        },
        transaction,
      }
    );

    if (!updatedPayment) {
      await transaction.rollback();
      return res.status(404).json({
        status: false,
        msg: "الدفع غير موجود",
      });
    } else {
      const payment = await conn.payments.findOne(
        {
          where: {
            payment_id: paymentId,
          },
          include: [
            {
              model: conn.donations_common,
              as: "donations_commons",
              include: ["gift", "case"],
            },
          ],
        },
        { transaction }
      );
      if (newStatus == "success" && payment) {
        payment.donations_commons.forEach(async (gift) => {
          if (gift.gift) {
            let sms_send;
            const message = gift.gift?.message
              ? gift.gift?.message
              : `تم التبرع لجمعية السرطان بالمنطقة الشرقية نيابة عن ${gift?.receiver_name}، جعله الله شفاءً وأجرًا.`;
            sms_send = await smsService.sendSMSMessage(
              message,
              gift.gift?.receiver_phone
            );
            const gift_result = await conn.gift_donations.update(
              { sms_sent: sms_send ? 1 : 0 },
              {
                where: {
                  id: gift?.gift?.id,
                },
                transaction,
              }
            );
          } else if (gift.case) {
            console.log("case donation", gift.case);
          }
        });
      }
    }

    await transaction.commit();

    // 8. Respond to Moyasar
    return res.status(200).json({
      status: true,
      msg: "تم معالجة الويب هوك بنجاح",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();

    console.error("Moyasar webhook error:", error);
    return res.status(500).json({
      status: false,
      msg: "حدث خطأ أثناء معالجة الويب هوك",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Helper function to verify Moyasar webhook signature
function verifyMoyasarSignature(payload, signature, secret) {
  try {
    if (signature == process.env.WEBHOOK_KEY) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Moyasar signature verification failed:", error);
    return false;
  }
}

exports.verify = async (req, res, next) => {
  try {
    // Extract paymentId from query parameters
    const { paymentId } = req.query;

    console.log({ paymentId });

    // Validate input
    if (!paymentId) {
      return res.status(400).json({
        status: false,
        msg: "معرف الدفع مطلوب",
      });
    }

    // Fetch payment record
    const payment = await conn.payments.findOne({
      where: { payment_id: paymentId },
    });

    // Check if payment exists
    if (!payment) {
      return res.status(404).json({
        status: false,
        msg: "الدفع غير موجود",
      });
    }

    // Check payment status (assuming payments table has a status field)
    if (payment.payment_status == "pending") {
      return res.status(200).json({
        status: true,
        payment_status: "pending",

        msg: "الدفع لم يكتمل بعد",
      });
    }

    if (payment.payment_status == "failed") {
      return res.status(200).json({
        status: true,
        payment_status: "failed",

        msg: "فشلت عملية الدفع",
      });
    }

    // // Prepare response data
    // const responseData = {
    //   payment_id: payment.id,
    //   status: payment.status,
    //   amount: payment.amount,
    //   created_at: payment.createdAt,
    //   donations:
    //     payment.donations?.map((d) => ({
    //       case_id: d.case_id,
    //       amount: d.amount,
    //       category_id: d.category_id,
    //     })) || [],
    //   gifts:
    //     payment.gifts?.map((g) => ({
    //       gift_id: g.gift_id,
    //       amount: g.amount,
    //       category_id: g.category_id,
    //     })) || [],
    // };

    return res.status(200).json({
      status: true,
      payment_status: "success",
      msg: "تم التحقق من الدفع بنجاح",
      data: payment,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({
      status: false,
      msg: "حدث خطأ في الخادم",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
exports.createPayments = async (req, res, next) => {
  try {
    console.log({ body: req.body });

    const result = await conn.payments.create(req.body);

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
    const result = await conn.payments.findAll({
      order: [["id", "DESC"]],
      offset: offset,
      include: [
        {
          model: conn.donations_common,
          as: "donation",
          include: ["case", "user", "category"],
        },
        "payment_method",
      ],
      limit: req.body.limit,
      subQuery: true,
    });
    const count = await conn.payments.findAll();
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
exports.getPaymentsById = async (req, res, next) => {
  try {
    const result = await conn.payments.findOne({
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

exports.getUserPaymentsById = async (req, res, next) => {
  try {
    console.log({ body: req.body });

    const result = await conn.payments.findOne({
      where: { payment_id: req.body.payment_id },
      include: [
        {
          model: conn.donations_common,
          as: "donations_commons",
          include: ["user", "gift", "case"],
        },
      ],
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
exports.updatePayments = async (req, res, next) => {
  try {
    const category = await conn.payments.findOne({
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
    await conn.payments.update(req.body, {
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
exports.deletePayments = async (req, res, next) => {
  try {
    const category = await conn.payments.findOne({
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

    await conn.payments.destroy({
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
