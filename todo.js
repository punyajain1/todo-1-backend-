let todo=[];

const jwt = require('jsonwebtoken');
const JWT_SECRET = "pjain";


const {UserModel , TodoModel} = require("./db.js");
const mongoose= require("mongoose");
mongoose.connect("mongodb+srv://admin:VowyYnkBsv1ZGvQu@cluster0.vuzwp.mongodb.net/todo-app-database");


async function adding(req, res) {
    try {
        const usrid = req.id;
        const user = await UserModel.findById(usrid);
        if(!user){
            return res.status(404).json({ msg: "User not found" });
        }
        const title = req.body.title;
        if(!title){
            return res.status(400).json({ msg: "Title is required" });
        }
        const newTodo = await TodoModel.create({
            admin_id: usrid,
            title: title,
            done: false
        });
        return res.status(201).json({ msg: "Todo created", todo: newTodo });
    } catch (error) {
        return res.status(404).json({ msg: "Internal server error", error: error.message });
    }


    //old method
    // const username = req.username;
    // const user = users.find(user => user.username === username);
    // const data = {
    //     "todo": req.body.todo,
    //     "id" : todo.length
    // }
    // todo.push(data);
    // res.json({msg: "Todo added", data});
}

async function showtodo(req,res){

    const usrid= req.id;
    const user = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(usrid) });
    try{
        if(user){
            const usertodo = await TodoModel.find({admin_id : usrid})
            res.json({
                usertodo
            })
        }
    }catch(error){
        res.status(403).json({
            msg:"user dose not exist"
        })
    }
}

async function deletingall(req, res) {
    const usrid= req.id;
    const user = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(usrid) });
    
    try{
        if(!user){
            return res.status(404).json({ msg: "User not found" });
        }
        await Todo.deleteMany({admin_id : usrid});
        return res.status(200).json({ msg: "All todos deleted for the user" });
    }catch(error){
        return res.status(500).json({ msg: "Error deleting todos", error: error.message });
    }
}

async function deleting(req, res) {
    const usrid= req.id;
    const user = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(usrid) });
    try{
        if(!user){
            return res.status(404).json({ msg: "User not found" });
        }
        const del=await TodoModel.findOneAndDelete({admin_id : usrid});
        if(!del){
            res.status(403).json({
                msg:"Todo dose not exist"
            })
        }
    }catch(e){
        res.status(403).json({
            msg: "Ivalid credentials"
        })
    }
    
    // if(!user) {
    //     return res.status(404).json({ msg: "User not found" });
    // }
    // const id = parseInt(req.query.id);
    // if (id >= 0 && id < todo.length) {
    //     todo.splice(id, 1);
    //     res.json({msg: "Todo deleted", id});
    // } else {
    //     res.status(400).json({msg: "Invalid ID"});
    // }
}
async function updateTodo (req, res, next){

    try{
        const usrid = req.id;
        const user = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(usrid) });
        if(!user){
            res.status(403).json({
                msg:"User cant be found"
            })
        }
        const uptodo = req.body.ndata;
        const usertodo = await TodoModel.findOneAndUpdate(usrid,{todo: uptodo},{new: true});

    }catch(e){

    }



    // if (!user) {
    //     return res.status(404).json({ msg: "User not found" });
    // }

    // const id = parseInt(req.query.id);
    // if (id >= 0 && id < user.todos.length) {
    //     user.todos[id].todo = req.body.update;
    //     res.json({ msg: "Todo updated" });
    // } else {
    //     res.status(400).json({ msg: "Invalid ID" });
    // }
    // next();
}

module.exports = {adding,showtodo,deleting,deletingall,updateTodo}