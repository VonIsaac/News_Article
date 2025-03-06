const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  role: { type: String, enum: ["admin", "user"], default: "user" },
},
{ timestamps: true }
);
UserSchema.index({ username: 1, email: 1 });
module.exports = mongoose.model("User", UserSchema);
