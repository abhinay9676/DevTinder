const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String,
        
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid");
            }
        }
    },
    about: {
        type: String,
        default: "this is about seion"
    },
    skills: {
        type: [String]
    },
    photoUrl: {
      type: String,
      default: "https://static.vecteezy.com/system/resources/previews/014/194/215/original/avatar-icon-human-a-person-s-badge-social-media-profile-symbol-the-symbol-of-a-person-vector.jpg"
    }

    

} ,{timestamps: true});


module.exports = mongoose.model("User" , userSchema);

//  todays target is to do vadliations and data sanitaition and check the mongoose document 