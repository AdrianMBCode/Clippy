const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn")
const User = require("../models/User.model")
const Ticket = require("../models/Ticket.model")


router.get("/:id/tickets/:ticketId", (req,res,next)=>{
    // let id = req.params.id
    // let ticketId = req.params.ticketId
    // Ticket.findById(ticketId)
    // .then((result)=>{
        // ***********************agregar {ticket: result, id} dp de render****************************
        res.render("senior/edit-ticket");
    // })
})

router.post("/:id/tickets/:ticketId", (req, res, next) => {
    let solution = req.body.solution;
    let ticketId = req.params.ticketId
    let id = req.params.id
    Ticket.findOneAndUpdate({_id: ticketId}, {solution: {text: solution, author: id, imgSolution: "RANDOMDATA"}, isPending:false}, {new: false})
    // *******************************************CAMBIAR RANDOM DATA*****************************************************************************
    .then((updatedTicket)=>{
        res.render("senior/profile");
    })
    .catch((err)=>console.log(err))
});

router.get("/:id/solved", (req, res, next) => {
    // let id = req.params.id
    // console.log(id)
    // User.findById(id)
    // .then((result)=>{
    //     if(result.role === "senior"){
    //         Ticket.find({$and:[{'solution.author': id}, {'isPending': false}]})
    //         .then((result)=>{
                // res.render("senior/solved-tickets", result);
    //         })
    //         .catch((err)=>console.log(err))
    //     }else if (result.role === "junior"){
    //         Ticket.find({$and:[{'author': id}, {'isPending': false}]})
    //         .then((result)=>{
        // ****************************agregar {tickets:result} dp render************************************
                res.render("junior/solved-tickets");
    //         })
    //     }else{
    //         res.redirect("/auth/login")
    //     }
    // }).catch((err)=>console.log(err))
});

router.post("/:id/tickets", (req, res, next) => {
    let id = req.params.id
    let {title, description, gitHubRepo, image} = req.body
    let newTicket = {title, description, gitHubRepo, image, author: id}
    Ticket.create(newTicket)
    .then((result)=>{
        res.render("junior/profile");
    })
    .catch((err)=>console.log(err))
});

router.get("/:id/tickets", (req, res, next) => {
    // let id = req.params.id
    // User.findById(id)
    // .then((result)=>{
    //     if(result.role === "senior"){
    //         Ticket.find()
    //         .then((result)=>{
    //             res.render("senior/tickets", {tickets:result});
    //         })
    //         .catch((err)=>console.log(err))
    //     }
    //     else if (result.role === "junior"){
            // ********************************agrergar result dp render*********************************
           res.render("junior/create-ticket");
    //     }
    //     else{res.redirect("/auth/login")}
    // }).catch((err)=>console.log(err))
});

router.get("/:id/pending", (req,res,next)=>{
    // let id = req.params.id
    // Ticket.find({$and:[{'author': id}, {'isPending': true}]})
    // .then((result)=>{
        // ************************agregar result dp render****************************
        res.render("junior/pending-tickets");
    // })
    // .catch((err)=>console.log(err))
})

router.get("/:id", (req, res, next) => {
    // let id = req.params.id
    // User.findById(id)
    // .then((result)=>{
    //     if(result.role === "senior"){
        // ***************agregar result dp render****************
            res.render("senior/profile")
    //     }else if (result.role === "junior"){
    //         res.render("junior/profile", result)
    //     }else if(result.role === "admin"){
    //         res.render("admin/profile", result)
    //     }else{
    //         res.redirect("/auth/login")
    //     }
    // })
    // .catch((err)=>console.log(err))
});






module.exports = router;