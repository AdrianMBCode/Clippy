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
     let id = req.params.id
     User.findById(id)
     .then((result)=>{
         if(result.role === "senior"){
            console.log(result, "hola rocio")
            //  Ticket.find({$and:[{'solution.author': id}, {'isPending': false}]})
            //  .then((result)=>{
                 res.render("senior/solved-tickets",{user: result});
            //  })
            //  .catch((err)=>console.log(err))
         }else if (result.role === "junior"){
             Ticket.find({$and:[{'author': id}, {'isPending': false}]})
             .then((data)=>{
        // ****************************agregar {tickets:result} dp render************************************
                res.render("junior/solved-tickets", {tickets:data, user: result});
             })
         }else{
             res.redirect("/auth/login")
         }
     }).catch((err)=>console.log(err))
});

router.post("/:id/tickets", (req, res, next) => {
    let id = req.params.id
    let {title, description, gitHubRepo, image} = req.body
    let newTicket = {title, description, gitHubRepo, image, author: id}
    User.findById(id)
    .then((data)=>{
        Ticket.create(newTicket)
        .then((result)=>{
        res.render("junior/pending", {user:data});
    })
    .catch((err)=>console.log(err))

    })
    
});

router.get("/tickets", (req, res, next) => {
    let user = req.session.currentUser
        User.findById(user._id)
        .then((result)=>{
             if(result.role === "senior"){
                Ticket.find()
                 .then((data)=>{
                    console.log(result);
                   res.render("senior/tickets", {tickets:data, user:result});
               })
                .catch((err)=>console.log(err))
            }
           else if (result.role === "junior"){
           res.render("junior/create-ticket", {user: result});
           }
           else{res.redirect("/auth/login")}
        }).catch((err)=>console.log(err))
});

router.get("/:id/pending", (req,res,next)=>{
    let id = req.params.id
    User.findById(id)
    .then((data)=>{
        Ticket.find({$and:[{'author': id}, {'isPending': true}]})
        .then((result)=>{
            res.render("junior/pending-tickets", {data: result, user:data});
        })
        .catch((err)=>console.log(err)) 
    }).catch((err)=>console.log(err))
     
})

router.get("/:id", (req, res, next) => {
    let id = req.params.id
    User.findById(id)
    .then((result)=>{
         if(result.role === "senior"){
        // ***************agregar result dp render****************
            res.render("senior/profile")
         }else if (result.role === "junior"){
             res.render("junior/profile", {data: result})
         }else if(result.role === "admin"){
             res.render("admin/profile", result)
         }else{
             res.redirect("/auth/login")
         }
     })
     .catch((err)=>console.log(err))
});






module.exports = router;