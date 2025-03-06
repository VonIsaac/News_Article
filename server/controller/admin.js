const News = require('../models/News');
const Tag = require('../models/Tag');

exports.postNews = async (req, res) => {
   
    try{
       
         // get the req body
        const { title, text, cathegory, author, source, images, tags} = req.body;

    // Validate required fields
        if(!title || !text  ||  !cathegory || !author || !source || !images || !tags){
            return res.status(400).json({error: 'All fields are required'});
        }

         // Ensure tags is an array of strings
        if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) {
          return res.status(400).json({ error: "Tags must be an array of strings" });
        }

        // Find existing tags (case-insensitive)
        const existingTags = await Tag.find({
          name: { $in: tags.map((tag) => new RegExp(`^${tag}$`, "i")) },
        });

        // Extract names of existing tags
        const existingTagNames = existingTags.map((tag) => tag.name.toLowerCase());

        // Find missing tags that are not in the database
        const missingTags = tags.filter((tag) => !existingTagNames.includes(tag.toLowerCase()));

        // Create missing tags in the database
        const newTags = await Tag.insertMany(missingTags.map((tag) => ({ name: tag })));

        // Combine existing and newly created tags
        const allTags = [...existingTags, ...newTags];

        // Map tag IDs
        const tagsMap = allTags.map((tag) => tag._id);
        console.log(tagsMap)
    // Create a new news
        const news = new News({
            title,
            text, 
            cathegory,
            author,
            source,
            images,
            tags: tagsMap
        })

        const postNews = await news.save();
        const populatedNews = await News.findById(postNews._id).populate("tags");
        return res.status(201).json({message: 'Post news success', postNews: populatedNews});
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Post news failed'});
    }
    
}

exports.deleteNews =  async (req, res) => {
    try{
        const {id} = req.params

        const news = await News.deleteOne({_id: id})
        if (news.deletedCount === 0) {
            return res.status(400).json({ message: "News not found or already deleted" });
        }
        
        res.status(200).json({ message: "News deleted successfully" });
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Delete News Failed'});
    }
}