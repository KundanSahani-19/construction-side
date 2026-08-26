const express = require("express");

const {
  createPayment,
  getPayments,
  getSitePayments,
  getLabourPayments,
  deletePayment,
} = require("../controllers/PaymentController");

const router = express.Router();


// ======================================================
// CREATE PAYMENT
// POST /api/payments
// ======================================================

router.post("/", createPayment);


// ======================================================
// GET ALL PAYMENTS
// GET /api/payments
// ======================================================

router.get("/", getPayments);


// ======================================================
// GET PAYMENTS OF ONE SITE
// GET /api/payments/site/:siteId
// ======================================================

router.get(
  "/site/:siteId",
  getSitePayments
);


// ======================================================
// GET PAYMENTS OF ONE LABOUR
// GET /api/payments/labour/:labourId
// ======================================================

router.get(
  "/labour/:labourId",
  getLabourPayments
);


// ======================================================
// DELETE PAYMENT
// DELETE /api/payments/:id
// ======================================================

router.delete(
  "/:id",
  deletePayment
);


module.exports = router;