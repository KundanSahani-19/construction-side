const express = require('express');

const router = express.Router();

const {
  createTransfer,
  getTransfers,
  getLabourTransfers
} = require('../controllers/LabourTransferController');


// Create transfer
router.post('/', createTransfer);


// All transfers
router.get('/', getTransfers);


// Particular labour history
router.get(
  '/labour/:labourId',
  getLabourTransfers
);


module.exports = router;