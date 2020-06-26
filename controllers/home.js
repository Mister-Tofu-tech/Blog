const BlogPost = require('../models/BlogPost');
exports.getAllPosts = async (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'public/index.html'))
    const blogposts = await BlogPost.find({})
    res.render('index', {blogposts})
}