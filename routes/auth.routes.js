const express = require("express");
const router = express.Router();
const transporter = require("../config/transporter.config")
const templates = require("../templates/template");

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/choice", isLoggedOut, (req, res, next) => {
  res.render("auth/choice");
});
router.get("/junior", isLoggedOut, (req, res, next) => {
  res.render("auth/junior");
});
router.get("/senior", isLoggedOut, (req, res, next) => {
  res.render("auth/senior");
});


// POST /auth/signup
router.post("/signup/:role", isLoggedOut, (req, res, next) => {
  const { username, email, password, repeatPassword } = req.body;
  let role = req.params.role;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "" || repeatPassword === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    res.status(400).render(`auth/${role}`, {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });

    return;
  }

  //   ! This regular expression checks password for special characters and minimum length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."
    });
    return;
  }
  */

  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({ username, email, password: hashedPassword, role });
    })
    .then((user) => {
      console.log("Usuario registrado: ", user);
            // elegir plantilla de correo basándose en el rol del usuario
            let message;
            //let message1;
            if (role === "junior") {
              message = templates.templateJunior(username);
            } else if (role === "senior") {
              message = templates.templateSenior(username);
            }
      
            // enviar correo electrónico
            transporter.sendMail({
              from: `"Clippy " <${process.env.EMAIL_ADDRESS}>`,
              to: email,
              subject: "Bienvenidos a Clippy",
              username: username,
              html: message,
            }, (err)=> console.log("error nodemailer" , err))
      
            res.redirect("/auth/login");
          })
          .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render(`auth/${role}`, { errorMessage: error.message });
            } else if (error.code === 11000) {
              res.status(500).render(`auth/${role}`, {
                errorMessage: "El nombre de usuario y el correo electrónico deben ser únicos. Proporcione un nombre de usuario o correo electrónico válido.",
              });
            } else {
              next(error);
            }
          });
      });

// GET /auth/login
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});



// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }
      
      // Check if user is junior or senior
      if (user.role === "junior") {
        // If user is a junior user, render the junior profile view
        req.session.currentUser = user.toObject();
        // Remove the password field
        delete req.session.currentUser.password;
        res.redirect(`/${user._id}`);

      } else if (user.role === "senior") {
        // If user is a senior user, render the senior profile view
        req.session.currentUser = user.toObject();
        // Remove the password field
        delete req.session.currentUser.password;
        res.render("senior/profile",{user: req.session.currentUser});
        
      } else if (user.role === "admin") {
        res.render("admin/profile")

      } else {
        // If the user's type is neither "junior" nor "senior", return an error
        res
          .status(400)
          .render("auth/login", { errorMessage: "Invalid user type." });
        return;
      }
    })
    .catch((err) => next(err));
});


// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
     if (err) {
       res.status(500).render("auth/logout", { errorMessage: err.message });
       return;
     }

     res.redirect("/");
   });
 });



module.exports = router;
