const express = require('express');
const router = express.Router();

router.post("/:id/ticket/:ticketId", (req, res, next) => {
    res.render("senior/edit-ticket");
});

router.get("/:id/pending", (req,res,next)=>{
    res.render("senior/pending-tickets");
})

router.get("/:id/solved", (req, res, next) => {
    res.render("senior/solved-tickets");
});

router.get("/:id/tickets", (req, res, next) => {
    res.render("senior/tickets");
});

router.get("/:id", (req, res, next) => {
  res.render("senior/profile");
});


module.exports = router;