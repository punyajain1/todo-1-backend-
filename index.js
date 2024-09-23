const express = require("express");
const app = express();
app.use(express.json());
const{ signupuser , signinuser } = require("./user.js");
const jwt = require('jsonwebtoken');
const { adding, updateTodo, deletingall, deleting, showtodo } = require("./todo.js");
const JWT_SECRET = "pjain";

const mongoose= require("mongoose");
const { UserModel, TodoModel } = require("./db.js");
mongoose.connect("mongodb+srv://admin:VowyYnkBsv1ZGvQu@cluster0.vuzwp.mongodb.net/todo-app-database");


function auth(req, res, next) {
    const token = req.headers.token;  // Assuming the token is passed in headers
    if (token) {
        jwt.verify(token, JWT_SECRET, function (err, decode) {
            if (err) {
                return res.status(401).json({
                    msg: "Invalid token"
                });
            }
            req.id = decode.id;
            next();
        });
    } else {
        return res.status(401).json({
            msg: "No token provided"
        });
    }
}




function logger(req,res,next){ // for method
    console.log(req.method+`method is called`);
    next();
}

app.get("/", function(req,res){//sending landing page
    res.sendFile(__dirname+"/public/index.html");
})

//signup , signin , me  
app.post("/signup",logger,signupuser);
app.post("/signin",logger,signinuser);
app.get("/me", auth,logger,(req, res) => {
    const user = req.username;
    res.send({
        username: user.username
    })
})



//todos-

// add todo
app.post('/addtodo',auth,adding);
// show todo
app.post('/showtodo',auth,showtodo);
// delete todo
app.delete('/deleteall',auth,deletingall);
//delete todo
app.delete('/delete/:id',auth,deleting);
//update todo
app.put('/todos/:id',auth,updateTodo);


app.listen(3000);
console.log("server is running on port 3000");