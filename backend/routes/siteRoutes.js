const express = require("express");

const {
  createSite,
  getSites,
  getSiteById,
  updateSite,
  deleteSite,
} = require("../controllers/SiteController");

const router = express.Router();

router.post("/", createSite);

router.get("/", getSites);

router.get("/:id", getSiteById);

router.put("/:id", updateSite);

router.delete("/:id", deleteSite);

module.exports = router;