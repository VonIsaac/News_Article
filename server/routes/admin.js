const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
const {authenticateToken} = require('../middleware/middleware')

router.post('/create-news', authenticateToken,  adminController.postNews);
router.delete('/delete-news/:id', adminController.deleteNews)

module.exports = router; 