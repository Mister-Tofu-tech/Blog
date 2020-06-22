const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlogPostSchema = new Schema({
    title: String,
    username: String,
    body: String,
    date: String,
    image: String
})

const BlogPost = mongoose.model('BlogPost', BlogPostSchema)
module.exports = BlogPost