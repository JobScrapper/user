const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');
const UploadController = require('../controllers/uploadFile');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.delete('/:username', UserController.deleteJobFromUser);
router.post('/:username', UserController.addJobToUser);
router.get('/:username', UserController.getUserByUsername);
router.put('/updateImage/:id', UploadController.uploadImage);
router.put('/updateCv/:id', UploadController.uploadPdf);
router.put('/updateBanner/:id', UploadController.uploadBanner);
router.put('/updateProfile/:id', UserController.updateUser)

module.exports = router;