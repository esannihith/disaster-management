const express = require('express');
const {
  createSupplyDonation,
  getSupplyDonations,
  getSupplyDonationById,
  updateSupplyDonation,
  deleteSupplyDonation,
} = require('../controllers/supplyDonationController');

const router = express.Router();

// Route to submit a supply donation
router.post('/', createSupplyDonation);

// Route to get all supply donations
router.get('/', getSupplyDonations);

// Route to get a single supply donation by ID
router.get('/:id', getSupplyDonationById);

// Route to update a supply donation
router.patch('/:id', updateSupplyDonation);

// Route to delete a supply donation
router.delete('/:id', deleteSupplyDonation);

module.exports = router;
