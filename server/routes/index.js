const express = require('express');
const ctrlReg = require('../controllers/reg');
const ctrlNews = require('../controllers/news');
const ctrlLogin = require('../controllers/login');


const router = express.Router();
console.log('начало работы рутера')

router.post('/registration', ctrlReg.post);
router.post('/news', ctrlNews.post);
router.post('/login', ctrlLogin.post);
router.post('/refresh-token', ctrlLogin.refresh);
router.post('/profile', ctrlLogin.profile);

// router.get('/profile', auth, (req, res) => {
//   res.json({
//       status: 1
//   })
// })

module.exports = router;