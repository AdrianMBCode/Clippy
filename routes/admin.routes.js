const express = require('express');
const router = express.Router();

router.get("/pendientes", (req, res, next) => {
    res.render("admin/pendientes");
});

router.get("/incidencias", (req, res, next) => {
    res.render("admin/incidencias");
});

router.get("/", (req, res, next) => {
  res.render("admin/profile");
});


module.exports = router;