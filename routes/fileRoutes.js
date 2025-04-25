const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const fileController = require('../controllers/fileController');
const authController = require('../controllers/authController');

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/files', fileController.getAllMediaAssets);
// router.get('/files/:fileId', fileController.getFiles);
router.delete('/files/:fileId', fileController.deleteFile);
// router.post('/delete', deleteFile);
// routes/authRoutes.js
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;


module.exports = router;
