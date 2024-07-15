const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

router.get('/AllAccounts', listController.Accounts);
router.get('/AllSubAccounts', listController.SubAccounts);
router.get('/AllCluster', listController.Clusters);
router.get('/AllService', listController.Services);

module.exports = router;