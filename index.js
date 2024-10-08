const express = require('express');
const app = express();
const path = require('path');
const fs= require('fs');
const { log } = require('console');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));


app.get('/', function(req,res){
    fs.readdir(`./files`, function(err, files){
        res.render('index',{files: files});
    }) 
})

app.get('/files/:filename', function(req,res) {
    fs.readFile(`./files/${req.params.filename}`,"utf-8", function(err,filedata){
        res.render('show', {filename: req.params.filename, filedata: filedata});
    })
})

app.get('/edit/:filename', function(req,res) {
    res.render('edit', {filename: req.params.filename});
})

app.post('/edit', function(req, res) {
    const previousName = req.body.Previous.trim();
    const newName = req.body.New.trim();

    if (!previousName || !newName) {
        return res.status(400).send("Previous name and new name are required.");
    }

    fs.rename(`./files/${previousName}`, `./files/${newName}`, function(err) {
        if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).send("Failed to rename file. Please try again.");
        }
        res.redirect("/");
    });
});



app.post('/create', function(req, res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
            res.redirect("/")
    });
})

app.listen(3000);

// fs.readdir is a method with the help of which you can read the directory and the contents of the directory
//title name= backend Domination :: So it will take backend.split like = ['Backend', 'Domination'] and backend.join will do :: backendDomination
//utf-8 covert in readable text that is english