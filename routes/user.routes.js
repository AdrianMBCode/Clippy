const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn")
const User = require("../models/User.model")
const Ticket = require("../models/Ticket.model")

router.get("/:id/tickets/:ticketId", (req,res,next)=>{
    let ticketId = req.params.ticketId
    Ticket.findById(ticketId)
    .then((result)=>{
        res.render("senior/edit-ticket");
    })
})

router.post("/:id/tickets/:ticketId", (req, res, next) => {
    let solution = req.body;
    let ticketId = req.params.ticketId
    Ticket.findOneAndUpdate({_id: ticketId}, solution, {new: true})
    .then((data)=>{
        console.log(data)
        res.render("senior/profile");
    })
    .catch((err)=>console.log(err))
});

router.get("/:id/solved", (req, res, next) => {
    let id = req.params.id
    User.findById(id)
    .then((result)=>{
        if(result.role === "senior"){
            Ticket.find({'solution.author': id})
            .then((result)=>{
                res.render("senior/solved-tickets", result);
            })
            .catch((err)=>console.log(err))
        }else if (result.role === "junior"){
            Ticket.find({"author": id})
            res.render("junior/solved-tickets", result);
        }else{
            res.redirect("/auth/login")
        }
    }).catch((err)=>console.log(err))
});

router.post("/:id/tickets", (req, res, next) => {
    let id = req.params.id
    res.render("junior/create-ticket", id);
});

router.get("/:id/tickets", (req, res, next) => {
    let id = req.params.id
    User.find(id)
    .then((result)=>{
        if(result.role === "senior"){
            Ticket.find()
            .then((result)=>{
                res.render("senior/tickets", result);
            })
            .catch((err)=>console.log(err))
        }
        else if (result.role === "junior"){
           res.render("junior/create-ticket", result);
        }
        else{res.redirect("/auth/login")}
    }).catch((err)=>console.log(err))
});

router.get("/:id/pending", (req,res,next)=>{
    let id = req.params.id
    Ticket.find({$and:[{'author': id}, {'isPending': true}]})
    .then((result)=>{
        res.render("junior/pending-tickets", result);
    })
    .catch((err)=>console.log(err))
})

router.get("/:id", isLoggedIn, (req, res, next) => {
    let id = req.params.id
    User.findById(id)
    .then((result)=>{
        if(result.role === "senior"){
            res.render("senior/profile", result)
        }else if (result.role === "junior"){
            res.render("junior/profile", result)
        }else{
            res.redirect("/auth/login")
        }
    })
    .catch((err)=>console.log(err))
});


module.exports = router;