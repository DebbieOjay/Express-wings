const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
// const fs = require("fs");
const mongoose = require("mongoose");
const User = require("./models/Users");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const session = require("express-session");

require("dotenv").config();

//middleware
const bodyParser = require("body-parser");
app.set("view engine", "ejs");

mongoose
  .connect(process.env.URI)
  .then(res => {
    console.log("database connected");

    app.listen(PORT, () => {
      console.log("Listening on port.....", PORT);
    });
  })
  .catch(err => {
    console.log("error connecting", err);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// const LocalStrategy = require('passport-local').Strategy;
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Route to HomePage
app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/sort", (req, res) => {
  res.render("sort");
});

app.get("/analysis", (req, res) => {
  res.render("analysis");
});    


app.get("/faq", (req, res) => {
  res.render("faqs");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

//Route to login page
app.get("/login", (req, res) => {
  res.render("login", { error: false, success: false, values: {} });
});

//Route to signup page
app.get("/signup", (req, res) => {
  res.render("signup", { error: false, success: false, values: {} });
});

app.post("/signup", (req, res) => {
  console.log("The request posted to signup", req.body);
  // const email = req.body.email;
  console.log(req.body);
  const payload = {
    fullname: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password
  };
  // save to database
  // const user = new User(payload);
  // User.findOne({ email }).then(user => {
  //   if (user) {
  //     // errors.push({ msg: "Email is already registered" });

  //     res.render("signup", {
  //       error: "Email already registered",
  //       success: false,
  //       values: {}
  //     });
  //   } else {
  const newUser = new User(payload);
  console.log(newUser);
  // bcrypt.genSalt(10, (err, salt) =>
  //   bcrypt.hash(newUser.password, salt, (err, hash) => {
  //     if (err) {
  //       console.log(err);
  //     }  
  //     newUser.password = hash;
  newUser
    .save()
    .then(user => {
      console.log(user);
      // req.flash("success_msg", "You are now registered and can log in");
      // res.redirect("/login");
      res.render("signup", {
        error: false, 
        success: "Successfully signed up, Please log in",
        values: {} 
      });
    })
    .catch(err => console.log(err));
});
//       );
// }
// });
// });

app.post("/login", (req, res, next) => {
  const email = req.body.email;
  const phone = req.body.password;
  console.log(email, phone);
  User.findOne({ email, phone }).then(user => {
    console.log(user);
    if (user) {
      res.render("home");
    } else {
      res.render("login", {
        error: "incorrect username or password"
      });
    }
  });

  // loginRouter.post("/", async (req, res, next) => {
  // passport.authenticate("local", {
  //   successRedirect: "/home",
  //   failureRedirect: "/login",
  //   failureFlash: true
  // })(req, res, next);
  // // });

  // module.exports = loginRouter;
});
   