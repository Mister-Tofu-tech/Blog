const express = require('express')
const path = require('path')
const app = new express()
const ejs = require('ejs')
const fs = require('fs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const BlogPost = require('./models/BlogPost')
const fileUpload = require('express-fileupload')

mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true, useUnifiedTopology: true})
app.use(express.static('public'))
app.set('view engine','ejs')
app.listen(4000, () => {
    console.log('App listening on port 4000')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload())

const validateMiddleWare = (req,res,next)=>{    
    if(req.files == null || req.body.title == null){   
        console.error("Invalid Input Detected ...");     
        return res.redirect('/posts/new');
    }    
    next()
}
app.use('/post/store',validateMiddleWare);


const homeController = require('./controllers/home');
app.get('/', homeController.getAllPosts );

const postActionController = require('./controllers/postAction');
app.get('/post/:id', postActionController.getPost);

app.get('/posts/new', postActionController.createPost);

app.post('/post/store', postActionController.storePost);

app.post('/post/search', postActionController.clickPost);

app.get('/search/:search?', postActionController.searchPost);