const express = require('express')
const path = require('path')
const app = new express()
const ejs = require('ejs')
const fs = require('fs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const BlogPost = require('./models/BlogPost')
const fileUpload = require('express-fileupload')
const firebase = require('firebase/app')
require('firebase/storage');
const { data } = require('jquery')
global.XMLHttpRequest = require('xhr2');

require('dotenv').config()

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "blog-10ed2.firebaseapp.com",
    databaseURL: "https://blog-10ed2.firebaseio.com",
    projectId: "blog-10ed2",
    storageBucket: "blog-10ed2.appspot.com",
    messagingSenderId: "462229385245",
    appId: "1:462229385245:web:cf2d1d79b2e0304570d6f4",
    measurementId: "G-PES0MWGV79"
  };
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const storageRef = storage.ref();
const metadata = {
    contentType: 'image/jpeg',
};

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
    if(req.files == null || req.body.title == null || req.body.title == null){        
        return res.redirect('/posts/new')
    }    
    next()
}
app.use('/post/store',validateMiddleWare);

app.get('/', async (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'public/index.html'))
    const blogposts = await BlogPost.find({})
    res.render('index', {blogposts})
})

app.get('/about', (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'public/about.html'))
    res.render('about')
})

app.get('/contact', (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'public/contact.html'))
    res.render('contact')
})

app.get('/post/:id', async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id);
    try{
        await storageRef.child(blogpost["image"]).getDownloadURL().then( url => {
            res.render('post', {blogpost, url});
        });
    } catch(error) {
        res.redirect('/');
    }
})

app.get('/posts/new', (req, res) => {
    res.render('create');
})

app.post('/post/store', async (req, res) => {
    var data = {...req.body, date: new Date().toLocaleString()};
    if(req.files){
        let image = req.files.image;
        // var bytes = new Uint8Array(image.data);
        // image.mv(path.resolve(__dirname, 'public/img', image.name), async (error) => {
        //     console.log(error);
        // });
        data['image'] = image.name;
        try{
            await storageRef.child(image.name).put(image.data, metadata);
        }catch(error){
            console.error(error);
        }
    }
    await BlogPost.create(data);
    res.redirect('/')
})

app.post('/post/search', async (req, res) => {
    const search = req.body['search'];
    res.redirect('/search/' + search);
})

app.get('/search/:search?', async (req, res) => {
    if(req.params.search === undefined){
        res.redirect('/');
    } else {
        const blogpost = await BlogPost.find({
            title: new RegExp(req.params.search)
        });
        res.render('search', {blogposts: blogpost})
    }
})