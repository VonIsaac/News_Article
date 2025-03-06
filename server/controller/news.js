const News = require('../models/News');
const Tag = require('../models/Tag')
const Like = require('../models/Like')
// getting the new
exports.getNews = async (req, res) => {

    try{
        const news = await News.find()
        .populate('tags', 'name')// use populate to get the tag details
        .sort({createdAt: -1})// Sort by newest news
        .select("title text cathegory author  source images likeCount dislikeCount tags createdAt"); // Select only the fields you need
        console.log(news)
        // chek if there is no news
        if(!news.length){
            return res.status(404).json({error: 'No news found'});
        }
        return res.status(200).json({news});
    }catch(err){
        console.error("Error fetching news:", err);
        return res.status(500).json({ error: "Failed to get news. Please try again." });
    }
}

// getting news by 3 data
exports.getNewsByPages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;

        const news = await News.find()
            .populate('tags', 'name')
            .sort({ createdAt: -1 })
            .select("title text cathegory author source images likeCount dislikeCount tags createdAt")
            .skip(skip)
            .limit(limit);

        if (!news.length) {
            return res.status(200).json({ news: [] }); // Return empty array instead of 404
        }

        return res.status(200).json({ news });
    } catch (err) {
        console.error("Error fetching news:", err);
        return res.status(500).json({ error: "Failed to get news. Please try again." });
    }
};


// getting single new by id
exports.getNewsById = async (req, res) => {
    try{
        const {id} = req.params
        const findNewsById = await News.findById(id)
        .populate("tags", "name"); // use populate to get the tags and name 
        console.log(findNewsById)
        if (!findNewsById) {
            return res.status(404).json({ error: "News article not found" });
          }
        res.status(200).json({findNewsById})
    }catch(err){
        console.error("Error fetching news:", err);
        return res.status(500).json({ error: "Failed to get news by id . Please try again." });
    }
};

// getting the single tag id

exports.getNewsByTag = async (req, res) => {
    try{
        const {tag} = req.params;

        // find  by tag bame or id
        const tagData = await Tag.findOne({
            name: tag.toLowerCase() // they get lowercases word
        })

        // check if a tag has found 
        if(!tagData){
            return res.status(404).json({ error: "Tag not found" });
        }

         //  Find news articles that contain this tag ID
         const news = await News.findOne({
            tags: tagData._id
         }).populate('tags', 'name')

         console.log(news)

         //check if the news are empty or not
         if (news.length === 0) {
            return res.status(404).json({ message: "No news articles found for this tag" });
        }

        return res.status(200).json({ news });

    }catch(err){
        console.error("Error fetching news:", err);
        return res.status(500).json({ error: "Failed to get news by tag . Please try again." });
    }
}

exports.toggleLikeAndDislike = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { likeType, userId } = req.body; //  and likeType should be sent in the request body

    // Check if likeType is valid
    if (!["like", "dislike"].includes(likeType)) {
      return res
        .status(400)
        .json({ error: "Invalid like type. Use 'like' or 'dislike'." });
    }

    // Check if the user already liked/disliked this news
    let existingLike = await Like.findOne({ newsId, userId });

    if (existingLike) {
      if (existingLike.likeType === likeType) {
        // Remove like/dislike if user clicks the same reaction again
        await Like.deleteOne({ _id: existingLike._id });

        const updateField =
          likeType === "like" ? { $inc: { like: -1 } } : { $inc: { dislike: -1 } };

        const news = await News.findByIdAndUpdate(newsId, updateField, { new: true });
        return res.status(200).json({ message: `Removed ${likeType} from news.`, news });
      } else {
        // If user changes reaction, update it
        existingLike.likeType = likeType;
        await existingLike.save();

        // Adjust News like/dislike counts correctly
        const updateFields =
          likeType === "like"
            ? { $inc: { like: 1, dislike: -1 } }
            : { $inc: { like: -1, dislike: 1 } };

        const news = await News.findByIdAndUpdate(newsId, updateFields, { new: true });
        return res.status(200).json({ message: `Updated reaction to ${likeType}.`, news });
      }
    } else {
      // If no previous like/dislike, add a new entry
      const newLike = new Like({ newsId,  likeType, userId });
      await newLike.save();

      const updateField =
        likeType === "like" ? { $inc: { like: 1 } } : { $inc: { dislike: 1 } };

      const news = await News.findByIdAndUpdate(newsId, updateField, { new: true });
      return res.status(201).json({ message: `Added ${likeType} to news.`, news });
    }
  } catch (err) {
    console.error("Error toggling like/dislike:", err);
    return res.status(500).json({ error: "Failed to like/dislike. Please try again." });
  }
};
