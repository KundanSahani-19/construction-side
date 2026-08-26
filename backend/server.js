const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// ==========================================
// EXISTING ROUTES
// ==========================================

const siteRoutes = require("./routes/siteRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const labourRoutes = require("./routes/labourRoutes");
const labourAssignmentRoutes = require("./routes/labourAssignmentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const labourTransferRoutes = require("./routes/labourTransferRoutes");
const coupleRoutes = require("./routes/coupleRoutes");
const coupleAttendanceRoutes = require("./routes/coupleAttendanceRoutes");
const measurementRoutes = require("./routes/measurementRoutes");

// ==========================================
// LABOUR ADVANCE
// ==========================================

const labourAdvanceRoutes = require(
  "./routes/LabourAdvanceRoutes"
);

// ==========================================
// LABOUR STATEMENT
// ==========================================

const labourStatementRoutes = require(
  "./routes/LabourStatementRoutes"
);

// ==========================================
// AUTHENTICATION
// ==========================================

const authRoutes = require(
  "./routes/authRoutes"
);

// ==========================================
// JWT AUTH MIDDLEWARE
// ==========================================

const {
  protect,
} = require("./middleware/authMiddleware");

// ==========================================
// ENVIRONMENT
// ==========================================

dotenv.config();

// ==========================================
// APP
// ==========================================

const app = express();

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ==========================================
// API ROUTES
// ==========================================

// ==========================================
// AUTHENTICATION — PUBLIC
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

// ==========================================
// PROTECTED API ROUTES
// ==========================================

// ------------------------------------------
// SITES
// ------------------------------------------

app.use(
  "/api/sites",
  protect,
  siteRoutes
);

// ------------------------------------------
// PAYMENTS
// ------------------------------------------

app.use(
  "/api/payments",
  protect,
  paymentRoutes
);

// ------------------------------------------
// LABOURS
// ------------------------------------------

app.use(
  "/api/labours",
  protect,
  labourRoutes
);

// ------------------------------------------
// LABOUR ASSIGNMENTS
// ------------------------------------------

app.use(
  "/api/labour-assignments",
  protect,
  labourAssignmentRoutes
);

// ------------------------------------------
// TEAMS
// ------------------------------------------

app.use(
  "/api/teams",
  protect,
  teamRoutes
);

// ------------------------------------------
// INDIVIDUAL ATTENDANCE
// ------------------------------------------

app.use(
  "/api/attendance",
  protect,
  attendanceRoutes
);

// ------------------------------------------
// LABOUR TRANSFERS
// ------------------------------------------

app.use(
  "/api/labour-transfers",
  protect,
  labourTransferRoutes
);

// ------------------------------------------
// COUPLES / JODI
// ------------------------------------------

app.use(
  "/api/couples",
  protect,
  coupleRoutes
);

// ------------------------------------------
// COUPLE ATTENDANCE
// ------------------------------------------

app.use(
  "/api/couple-attendance",
  protect,
  coupleAttendanceRoutes
);

// ------------------------------------------
// MEASUREMENTS
// ------------------------------------------

app.use(
  "/api/measurements",
  protect,
  measurementRoutes
);

// ==========================================
// LABOUR ADVANCE
// ==========================================

app.use(
  "/api/labour-advances",
  protect,
  labourAdvanceRoutes
);

// ==========================================
// LABOUR STATEMENT
// ==========================================

app.use(
  "/api/labour-statements",
  protect,
  labourStatementRoutes
);

// ==========================================
// HEALTH CHECK — PUBLIC
// ==========================================

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      message: "Construction Side API is running 🚀",
      version: "1.0.0",
    });
  }
);

// ==========================================
// 404 API HANDLER
// ==========================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message: `API route not found: ${req.method} ${req.originalUrl}`,
    });
  }
);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (error, req, res, next) => {
    console.error(
      "GLOBAL SERVER ERROR:",
      error
    );

    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
);

// ==========================================
// SERVER
// ==========================================

const PORT =
  process.env.PORT || 5001;

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  }
);