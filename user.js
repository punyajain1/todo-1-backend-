const users = [];
const jwt = require('jsonwebtoken');
const JWT_SECRET = "pjain";

const mongoose= require("mongoose");
mongoose.connect("mongodb+srv://admin:VowyYnkBsv1ZGvQu@cluster0.vuzwp.mongodb.net/todo-app-database");
const {UserModel,TodoModel } = require("./db.js");


async function signupuser(req,res){
    // const username = req.body.username;
    // const password = req.body.password;

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        email: email,
        password: password,
        name: name
    });
    
    res.json({
        message: "You are signed up"
    })
    
    
    //old method of storing in list
    // users.push({
    //     username : username,
    //     password : password
    // })
    // res.json({
    //     msg: "you have signed in!!!!"
    // })
}
async function signinuser(req, res){
    const email = req.body.email;
    const password = req.body.password;
    
    const user = await UserModel.findOne({ email });
    const usrid = user.id;
    if (!user || user.password !== password) {
        return res.status(403).json({ message: "Incorrect credentials" });
    }
    else if(user){
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.json({ token : token });
    }else{
        res.status(403).json({
            message: "Incorrect creds"
        })
    }

    // const user = users.find(user => user.username === username && user.password === password);
    // let foundUser = null;
    // for (let i = 0; i<users.length; i++) {
    //     if (users[i].username == username && users[i].password == password) {
    //         foundUser = users[i]
    //     }
    // }
    // if (foundUser) {
    //     const token = jwt.sign({
    //         username: username,
    //         passward: password,
    //     }, JWT_SECRET);

    //     user.token = token;
    //     res.json({
    //         token: token
    //     })
    // } else {
    //     res.status(403).send({
    //         message: "Invalid username or password"
    //     })
    // }
}

module.exports = { signupuser, signinuser };