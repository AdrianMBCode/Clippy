const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn")
const User = require("../models/User.model")
const Ticket = require("../models/Ticket.model")
const Review = require("../models/Review.model")


router.get("/:id/tickets/:ticketId", (req,res,next)=>{
    let user = req.session.currentUser
    let ticketId = req.params.ticketId
    Ticket.findById(ticketId)
    .then((result)=>{
        // ***********************agregar {ticket: result, id} dp de render****************************
        res.render("senior/edit-ticket", {ticket:result, user});
    }).catch((err)=>console.log(err))
})

router.post("/:id/tickets/:ticketId", (req, res, next) => {
    let user = req.session.currentUser
    let {solution, imgSolution} = req.body;
    let ticketId = req.params.ticketId
    let id = req.params.id
    Ticket.findOneAndUpdate({_id: ticketId}, {solution: {text: solution, author: id, imgSolution}, isPending:false}, {new: false})
    .then((updatedTicket)=>{
        Ticket.find({isPending: true})
        .populate("author")
         .then((data)=>{
           res.render("senior/tickets", {tickets:data, user});
       })
        .catch((err)=>console.log(err))
    })
    .catch((err)=>console.log(err))
});

router.post("/:id/:ticketId/review",(req,res,next)=>{
    let id = req.params.id
    let associatedTicket = req.params.ticketId;
    let {rate, description} = req.body;
    Review.create({rating: rate, description})
    .then((data)=>{
        Ticket.findByIdAndUpdate({_id:associatedTicket},{associatedReview:data._id,isReviewed: true},{new: false})
        .then((data)=>{
            res.redirect(`/${id}`)
        }).catch((err)=>console.log(err))
    }).catch((err)=>console.log(err))
})

router.get("/:id/solved", (req, res, next) => {
     let id = req.params.id
     User.findById(id)
     .then((result)=>{
         if(result.role === "senior"){
             Ticket.find({$and:[{'solution.author': id}, {'isPending': false}]})
             .then((data)=>{
                console.log(data)
                 res.render("senior/solved-tickets",{tickets: data, user:result});
             })
             .catch((err)=>console.log(err))
         }else if (result.role === "junior"){
             Ticket.find({$and:[{'author': id}, {'isPending': false}, {'isReviewed': false}]})
             .then((data)=>{
                console.log(data)
                res.render("junior/solved-tickets", {tickets:data, user: result});
             })
             .catch((err)=>console.log(err))
         }else{
             res.redirect("/auth/login")
         }
     }).catch((err)=>console.log(err))
});

router.post("/:id/tickets", (req, res, next) => {
    let technologiesUsed = ["CSS", "Javascript", "HTML"]
    let {title, description, image, gitHubRepo} = req.body;
    let repo = "https://github.com/" + gitHubRepo
    let id = req.params.id
    let newTicket = {title, description, gitHubRepo:repo, image, author: id, technologiesUsed}
    User.findById(id)
    .then((data)=>{
        Ticket.create(newTicket)
        .then((result)=>{
        res.render("junior/pending-tickets", {user:data});
    })
    .catch((err)=>console.log(err))
    })  
});

router.get("/seniors", (req,res,next)=>{
    let user = req.session.currentUser
    User.find({role:"senior"})
    .then((data)=>{
        res.render("admin/seniors", {seniors: data, user})
    })
    .catch((err)=>console.log(err))
})

router.get("/tickets", (req, res, next) => {
    let user = req.session.currentUser
        User.findById(user._id)
        .then((result)=>{
             if(result.role === "senior"){
                Ticket.find({isPending: true})
                .populate("author")
                 .then((data)=>{
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
            res.render("junior/pending-tickets", {tickets: result, user:data});
        })
        .catch((err)=>console.log(err)) 
    }).catch((err)=>console.log(err))
     
})



router.get("/aproved/:id", (req, res, next) => {
    let id = req.params.id;
    User.findOneAndUpdate({_id: id},{role: "senior"}, {new: false})
    .then(result => {
        console.log(result)
        res.redirect(`/${id}`)
    })
    .catch((err)=>console.log(err))
})

router.get("/delete/:id", (req, res, next) => {
    let id = req.params.id;
    User.findByIdAndDelete(id)
    .then(result => {
        res.redirect(`/${id}`)
    })
    .catch((err)=>console.log(err))
})

router.get("/:id", (req, res, next) => {
    let id = req.params.id
    User.findById(id)
    .then((result)=>{
         if(result.role === "senior"){
        // ***************agregar result dp render****************
            Ticket.find({'isPending': true})
            .then((data)=>{
                res.render("senior/tickets", {tickets:data,user:result, user:result})
            }).catch((err)=>console.log(err))
         }else if (result.role === "junior"){
             res.render("junior/profile", {data: result})
         }else if(result.role === "admin"){
            User.find({'role': 'pending'})
            .then((data)=>{
                console.log(data)
                res.render("admin/profile", {user:result, data})
            }).catch((err)=>console.log(err))
         }else{
             res.redirect("/auth/login")
         }
     })
     .catch((err)=>console.log(err))
});








module.exports = router;