const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');
const UploadController = require('../controllers/uploadFile')

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.put('/updateProfile/:id', UploadController.uploadFile);

module.exports = router;