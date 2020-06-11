const express = require('express');
const router = new express.Router();
const inboxController = require('../controllers/inboxController');
const auth = require('../middlewares/auth');



router.post('/users/addNewMessage', auth ,inboxController.addMessage);


module.exports = router