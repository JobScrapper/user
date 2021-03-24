const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');
const UploadController = require('../controllers/uploadFile')

router.get('/:username', UserController.getUserByUsername);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.put('/updateImage/:id', UploadController.uploadImage);
router.put('/updateCv/:id', UploadController.uploadPdf);
router.put('/updateBanner/:id', UploadController.uploadBanner);
router.put('/updateProfile/:id', UserController.updateUser)

module.exports = router;