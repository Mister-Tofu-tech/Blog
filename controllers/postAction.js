const BlogPost = require('../models/BlogPost');
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

exports.getPost = async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id);
    try{
        await storageRef.child(blogpost["image"]).getDownloadURL().then( url => {
            res.render('post', {blogpost, url});
        });
    } catch(error) {
        res.redirect('/');
    }
}

exports.clickPost = async (req, res) => {
    const search = req.body['search'];
    res.redirect('/search/' + search);
}

exports.storePost = async (req, res) => {
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
}

exports.createPost = async (req, res) => {
    res.render('create');
}

exports.searchPost =  async (req, res) => {
    if(req.params.search === undefined){
        res.redirect('/');
    } else {
        const blogpost = await BlogPost.find({
            title: new RegExp(req.params.search)
        });
        res.render('search', {blogposts: blogpost})
    }
}


