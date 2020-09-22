const express = require('express');
const ctrlReg = require('../controllers/reg');
const ctrlNews = require('../controllers/news');
const ctrlLogin = require('../controllers/login');


// eslint-disable-next-line new-cap
const router = express.Router();
console.log('начало работы рутера');

router.post('/registration', ctrlReg.post);
router.post('/news', ctrlLogin.auth, ctrlNews.post);
router.get('/news', ctrlLogin.auth, ctrlNews.get);
router.delete('/news/:newsId', ctrlNews.delete);
router.patch('/news/:newsId', ctrlNews.patchNews);
router.post('/login', ctrlLogin.post);
router.post('/refresh-token', ctrlLogin.refresh);
router.get('/profile', ctrlLogin.auth, ctrlLogin.getProfile);
router.patch('/profile', ctrlLogin.auth, ctrlLogin.updateProfile);
router.patch('/users/:userId/*', ctrlLogin.permissions);
router.delete('/users/:userId', ctrlLogin.delete);
router.get('/users', ctrlLogin.auth, ctrlLogin.userList);

module.exports = router;
