const express = require('express')
const path = require('path')
const app = new express()
const ejs = require('ejs')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true})
app.use(express.static('public'))

app.listen(4000, () => {
    console.log('App listening on port 4000')
})

app.get('/', (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'public/index.html'))
    res.render('index')
})

app.get('/about', (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'public/about.html'))
    res.render('about')
})

app.get('/contact', (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'public/contact.html'))
    res.render('contact')
})

app.get('/post', (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'public/post.html'))
    res.render('post')
})