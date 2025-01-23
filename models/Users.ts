// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please provide your name"],
//   },
//   email: {
//     type: String,
//     required: [true, "Please provide your email"],
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: [true, "Please provide a password"],
//     minlength: 8,
//     select: false,
//   },
//   image: {
//     type: String,
//     default: "https://www.gravatar.com/avatar/?d=mp",
//   },
//   bio: String,
//   location: String,
//   website: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// // Compare password method
// userSchema.methods.comparePassword = async function (
//   candidatePassword: string
// ) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.models.User || mongoose.model("User", userSchema);
