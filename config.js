const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Ramestro", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected successfully");
  } catch (error) {
    console.error("Database cannot be connected", error);
  }
};

connect();

const LoginSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  ConfirmPassword: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model("Users", LoginSchema);

module.exports = Users;
