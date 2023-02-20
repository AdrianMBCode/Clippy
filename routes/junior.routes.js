const express = require('express');
const router = express.Router();

router.get("/:id/solved", (req,res,next)=>{
    res.render("junior/solved-tickets");
})

router.get("/:id/pending", (req,res,next)=>{
    res.render("junior/pending-tickets");
})

router.get("/:id/ticket", (req, res, next) => {
    res.render("junior/create-ticket");
});

router.post("/:id/ticket", (req, res, next) => {
    res.render("junior/create-ticket");
});

router.get("/:id", (req, res, next) => {
  res.render("junior/profile");
});


module.exports = router;