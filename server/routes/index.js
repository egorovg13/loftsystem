const express = require('express');
const ctrlReg = require('../controllers/reg');

const router = express.Router();
console.log('начало работы рутера')

router.post('/api/registration', ctrlReg.post);

module.exports = router;