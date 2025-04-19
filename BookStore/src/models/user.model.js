import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        index: true,
    },
    password:{
        type:String,
        required:true,
    },
    role: { 
        type: String,
        enum: ['admin', 'merchant', 'user'],
        default: 'user', // Mặc định là user
    },
    lastLogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    phoneNumber: {
        type: [String],
        default: []
    },
    profile: {
        age: Number,
        gender: String,
    },
    address: {
        type: [String],
        default: []
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, {timestamps:true});

// Create and export the User model
const User = mongoose.model('User', userSchema);
export default User;