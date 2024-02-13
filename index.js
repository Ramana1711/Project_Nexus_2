const express = require("express");
const bcrypt = require("bcrypt");
const collection = require("./config");
const app = express();

//convert data into jason format
app.use(express.json());
// Use EJS as the view engine
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));
app.use(express.static("src"));

// Middleware to parse POST request bodies
app.use(express.urlencoded({ extended: true }));

// Render home page
app.get("/home", (req, res) => {
  res.render("home");
});

// Render login page
app.get("/", (req, res) => {
  res.render("login");
});

// Handle login form submission
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ UserName: req.body.username });
    let isPasswordMatch = false;
    // If the user exists and the password is correct
    if (check) {
      isPasswordMatch = await bcrypt.compare(req.body.password, check.Password);
    }
    if (!check || isPasswordMatch) {
      res.send("check the UserName and Password");
    } else {
      res.redirect("/home");
    }
  } catch (err) {
    console.error("error in login route", err);
    console.log("Sending error response");
    return res.send("error");
  }
});

// Render signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Handle signup form submission
app.post("/signup", async (req, res) => {
  const data = {
    UserName: req.body.username,
    Email: req.body.email,
    Password: req.body.password,
    ConfirmPassword: req.body.confirmpassword,
  };
  const existingEmail = await collection.findOne({ Email: data.Email });
  if (existingEmail) {
    res.send("Email already exist. Please try to login");
  } else {
    //hash the code
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.Password, saltRounds);
    data.Password = hashedPassword;
    const userdata = await collection.insertMany(data);
    res.redirect("/");
  }
});
const port = 3000;
app.listen(port, () => {
  console.log("Server running on port: " + port);
});
