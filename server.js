var express = require('express');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient , assert = require('assert');
var app = express();

const bodyParser = require('body-parser');
const pug = require('pug');
const path = require('path');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('stylesheets'));

//Kollar om anslutningen till mongodb fungerar
mongoose.connect('mongodb://localhost:27017/food');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we are connected");
});                   

//Sätter strukturen för tabellen i databasen
var FoodSchema = new mongoose.Schema({
    name: String,
    points: Number
});
var food = mongoose.model('food', FoodSchema);

//Bestämmer vilken port som projektet ska lyssnas på och skickar med en funktion
app.listen(3000, listening);

app.get('/', function (req,res){
    food.find(function (err, foods) {
        if (err) return console.error(err);

        res.render('index',{foods});
    });
});

app.set('views', path.join(__dirname,'/views'));
app.set('view engine', 'pug');

//Här är alla routes
app.post('/add' , add);
app.post('/delete' , deleteFromDb);
app.post('/update' , update);

//Denna funktionen updaterar databasen med nya input från input fälten och hämtar in matchande id för att ändra rätt.
function update(req,res){
    var  name= req.body.updateFoods;
    var score = req.body.updateScore;
    var id = req.body.updateId;
    food.findOne({_id: id}, function (err, doc){
        if (err){
            res.send('error');
        }
        else{
            doc.name = name;
            doc.points = score;
            doc.save();
             res.redirect('/');
        }
    })
}
//Denna funktion tar bort en från databas där id:t matchar
function deleteFromDb(req,res){
    var foodId = req.body.delete;
    food.deleteOne({ _id: foodId }, function(err) {
        if (err) {
           res.send('error!');
        }
        else {
            res.redirect('/');
        }

    });
}
//Denna funktion loggar ut -listening när man startar projektet
function listening(){
    console.log('-listening...')
}
//Denna funktion tar in input från input fälten och lägger till en ny kolumn i databasen.
//Kollar om scores verkligen är en siffra, annars skickar den ut "update failed"
function add(req, res){
    var scores = parseInt(req.body.score);
    var foodName = req.body.foods;
    var newFood = new food({name:foodName, points: scores});

    if(parseInt(scores)){
        newFood.save(function (err, newFood) {
            if (err) return console.error(err);
        });
    }else{
        res.send('Update failed')
    }
    res.redirect('/');
}


