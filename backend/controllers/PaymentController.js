const Payment = require("../models/Payment");
const Site = require("../models/Site");

// ======================================================
// CREATE PAYMENT
// ======================================================

const createPayment = async (req, res) => {
  try {
    const {
      labour,
      site,
      amount,
      paymentDate,
      paymentType,
      reason,
      paymentMode,
      referenceNumber,
      notes,
    } = req.body;

    // Basic validation
    if (!site) {
      return res.status(400).json({
        success: false,
        message: "Site is required",
      });
    }

    if (amount === undefined || amount === null || amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payment amount is required",
      });
    }

    if (!paymentDate) {
      return res.status(400).json({
        success: false,
        message: "Payment date is required",
      });
    }

    // Payment create
    const payment = await Payment.create({
      labour: labour || null,
      site,
      amount,
      paymentDate,
      paymentType: paymentType || "Advance",
      reason: reason || "",
      paymentMode: paymentMode || "Cash",
      referenceNumber: referenceNumber || "",
      notes: notes || "",
    });

    // ==================================================
    // Site ka received amount update
    // ==================================================

    const payments = await Payment.find({
      site: payment.site,
      labour: null,
    });

    const totalReceived = payments.reduce(
      (total, item) => total + Number(item.amount || 0),
      0
    );

    await Site.findByIdAndUpdate(payment.site, {
      receivedAmount: totalReceived,
    });

    // ==================================================
    // Full populated payment return
    // ==================================================

    const updatedPayment = await Payment.findById(payment._id)
      .populate("labour", "name labourType")
      .populate("site", "siteName clientName location");

    res.status(201).json({
      success: true,
      message: "Payment added successfully",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// GET ALL PAYMENTS
// ======================================================

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("labour", "name labourType")
      .populate("site", "siteName clientName location contractAmount")
      .sort({
        paymentDate: -1,
        createdAt: -1,
      });

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// GET PAYMENTS OF ONE SITE
// ======================================================

const getSitePayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      site: req.params.siteId,
    })
      .populate("labour", "name labourType")
      .populate("site", "siteName clientName location")
      .sort({
        paymentDate: -1,
        createdAt: -1,
      });

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Get site payments error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// GET PAYMENTS OF ONE LABOUR
// ======================================================

const getLabourPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      labour: req.params.labourId,
    })
      .populate("labour", "name labourType")
      .populate("site", "siteName clientName location")
      .sort({
        paymentDate: -1,
        createdAt: -1,
      });

    const totalPaid = payments.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

    res.json({
      success: true,
      count: payments.length,
      totalPaid,
      data: payments,
    });
  } catch (error) {
    console.error("Get labour payments error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// DELETE PAYMENT
// ======================================================

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(
      req.params.id
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const siteId = payment.site;

    await Payment.findByIdAndDelete(req.params.id);

    // Site received amount dobara calculate
    const remainingPayments = await Payment.find({
      site: siteId,
      labour: null,
    });

    const totalReceived = remainingPayments.reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );

    await Site.findByIdAndUpdate(siteId, {
      receivedAmount: totalReceived,
    });

    res.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Delete payment error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createPayment,
  getPayments,
  getSitePayments,
  getLabourPayments,
  deletePayment,
};