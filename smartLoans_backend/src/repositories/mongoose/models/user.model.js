const mongoose = require("mongoose");
 
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            },
            message: "Invalid email format."
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (value) {
                return /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
            },
            message: "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character."
        }
    },
    roles: {
        type: [String],
        enum: ["user", "banker", "admin"],
        default: ["user"]
    },
    active: {
        type: Boolean,
        default: true
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,  
        default: null,
        validate: {
            validator: function (value) {
                return value === null || value > new Date();
            },
            message: "OTP expiry must be a future date."
        }
    },
    accountNumber: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[6-9]\d{9}$/.test(value);
            },
            message: "Phone number must be a valid 10-digit number starting with 6, 7, 8, or 9."
        }
    },
    address: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200
    },
    gender :{
        type : String,
        required:true,
        enum:["Female","Male","Others"]

    },
    pannumber:{
        type: String,
        required: true
    },
    aadharnumber:{
        type: String,
        required: true
    }
});


 
const User = mongoose.model("User", userSchema,'users');

module.exports = User;
