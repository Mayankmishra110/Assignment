const express = require('express');
const multer = require('multer');
const candidateController = require('../controllers/candidateController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), candidateController.uploadCandidates);

module.exports = router;
