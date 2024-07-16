const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

router.get('/AllAccounts', listController.Accounts);
router.get('/AllSubAccounts', listController.SubAccounts);
router.get('/AllClusters', listController.Clusters);
router.get('/AllServices', listController.Services);

module.exports = router;