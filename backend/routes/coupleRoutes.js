const express = require("express");

const {
  createCouple,
  getCouples,
  getCoupleById,
  updateCouple,
  deleteCouple,
} = require("../controllers/CoupleController");

const router = express.Router();


// CREATE
router.post("/", createCouple);


// GET ALL
router.get("/", getCouples);


// GET BY ID
router.get("/:id", getCoupleById);


// UPDATE
router.put("/:id", updateCouple);


// DELETE
router.delete("/:id", deleteCouple);


module.exports = router;