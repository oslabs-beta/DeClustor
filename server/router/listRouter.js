const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

// GET route to list all accounts saving in credentials database
router.get('/AllAccounts', listController.Accounts);
// GET route to list all subaccounts under root credentials
router.get('/AllSubAccounts', listController.SubAccounts);
// GET route to list all ECS clusters under one root account or subaccount
router.get('/AllClusters', listController.Clusters);
// GET route to list all services within a specified cluster.
router.get('/AllServices', listController.Services);

module.exports = router;