const express = require('express');
const router = express.Router();
const newsController = require('../controller/news');

router.get('/get-news', newsController.getNews);
router.get('/news-page', newsController.getNewsByPages)
router.get('/get-news/:id', newsController.getNewsById);
router.get('/get-tag/:tag', newsController.getNewsByTag);
router.post('/like-dislike/:newsId', newsController.toggleLikeAndDislike)

module.exports = router;