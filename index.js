const express = require('express')
const path = require('path')
const app = new express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const BlogPost = require('./models/BlogPost')
const fileUpload = require('express-fileupload')
const { data } = require('jquery')

const router = express.Router({strict: true});
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
    res.render('index', {blogposts: blogposts})
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
    res.render('post', {blogpost});
})

app.get('/posts/new', (req, res) => {
    res.render('create');
})

app.post('/post/store', async (req, res) => {
    var data = {...req.body, date: new Date().toLocaleString()};
    if(req.files){
        let image = req.files.image;
        image.mv(path.resolve(__dirname, 'public/img', image.name), async (error) => {
            console.log(error);
        });
        data['image'] = '/img/' + image.name;
        console.log(data);
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