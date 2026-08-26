const express = require("express");

const {
  login,
} = require("../controllers/AuthController");

const router = express.Router();

// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================
router.post("/login", login);

module.exports = router;