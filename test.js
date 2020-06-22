const mongoose = require('mongoose')
const BlogPost = require('./models/BlogPost')

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

var id = "5ee8533ba78e7500e35c2176"
BlogPost.findByIdAndUpdate(id, {title: "Update Test"}, (error, blogposts) => {
    console.log(error, blogposts)
})

BlogPost.create({
    title: "Spider Man",
    body: "Get Bitten By a Spider and Become Spiderman"
}, (error, blogpost) => {
    console.log(blogpost)
})