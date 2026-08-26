const LabourTransfer = require('../models/LabourTransfer');
const Labour = require('../models/Labour');


// ==========================================
// CREATE TRANSFER
// ==========================================

exports.createTransfer = async (req, res) => {

  try {

    const {
      labour,
      fromSite,
      toSite,
      transferDate,
      reason,
      notes
    } = req.body;


    if (!labour) {
      return res.status(400).json({
        success: false,
        message: 'Labour required'
      });
    }


    if (!fromSite) {
      return res.status(400).json({
        success: false,
        message: 'From site required'
      });
    }


    if (!toSite) {
      return res.status(400).json({
        success: false,
        message: 'To site required'
      });
    }


    if (fromSite === toSite) {
      return res.status(400).json({
        success: false,
        message: 'From site and To site same nahi ho sakti'
      });
    }


    const labourRecord = await Labour.findById(labour);

    if (!labourRecord) {
      return res.status(404).json({
        success: false,
        message: 'Labour not found'
      });
    }


    const transfer = await LabourTransfer.create({
      labour,
      fromSite,
      toSite,
      transferDate: transferDate || new Date(),
      reason: reason || '',
      notes: notes || ''
    });


    // Labour ki current site update
    labourRecord.currentSite = toSite;

    await labourRecord.save();


    const populatedTransfer =
      await LabourTransfer.findById(transfer._id)
        .populate('labour', 'name labourType')
        .populate('fromSite', 'siteName location')
        .populate('toSite', 'siteName location');


    res.status(201).json({

      success: true,

      message: 'Labour transferred successfully',

      data: populatedTransfer

    });

  } catch (error) {

    console.error(
      'Create transfer error:',
      error
    );

    res.status(500).json({

      success: false,

      message: 'Transfer create nahi hua',

      error: error.message

    });

  }

};


// ==========================================
// GET ALL TRANSFERS
// ==========================================

exports.getTransfers = async (req, res) => {

  try {

    const transfers =
      await LabourTransfer.find()
        .populate('labour', 'name labourType')
        .populate('fromSite', 'siteName location')
        .populate('toSite', 'siteName location')
        .sort({
          transferDate: -1
        });


    res.json({

      success: true,

      count: transfers.length,

      data: transfers

    });

  } catch (error) {

    console.error(
      'Get transfers error:',
      error
    );

    res.status(500).json({

      success: false,

      message: 'Transfers load nahi hue',

      error: error.message

    });

  }

};


// ==========================================
// GET LABOUR TRANSFER HISTORY
// ==========================================

exports.getLabourTransfers = async (req, res) => {

  try {

    const transfers =
      await LabourTransfer.find({
        labour: req.params.labourId
      })
        .populate('labour', 'name labourType')
        .populate('fromSite', 'siteName location')
        .populate('toSite', 'siteName location')
        .sort({
          transferDate: -1
        });


    res.json({

      success: true,

      count: transfers.length,

      data: transfers

    });

  } catch (error) {

    console.error(
      'Labour history error:',
      error
    );

    res.status(500).json({

      success: false,

      message: 'Labour history load nahi hui',

      error: error.message

    });

  }

};