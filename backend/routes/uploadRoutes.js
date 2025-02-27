const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController.js');
const upload = require('../config/multerConfig.js');

router.post('/', upload.single('image'), uploadController.uploadImage);

module.exports = router;