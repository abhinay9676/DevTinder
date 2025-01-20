 const validator = require("validator"); 



 const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    console.log("Received Data:", req.body);

    if (!firstName || !lastName) {
        console.log("Validation Failed: Missing names");
        throw new Error("First and last names are required.");
    }

    if (!emailId || !validator.isEmail(emailId)) {
        console.log("Validation Failed: Invalid email");
        throw new Error("A valid email address is required.");
    }

    if (!password || !validator.isStrongPassword(password, { minLength: 8, minSymbols: 1 })) {
        console.log("Validation Failed: Weak password");
        throw new Error(
            "Password must be at least 8 characters long, contain at least 1 symbol, 1 uppercase letter, and 1 number."
        );
    }

    console.log("Validation Passed!");
};


const validateEditProfile = (req) => {
    const allowedUpdates = ['firstName', 'lastName', 'age', 'gender', 'about' , 'skills', 'photoUrl'];

    const isEditUpdates = Object.keys(req.body).every(field => allowedUpdates.includes(field));

    return isEditUpdates;
};


    





module.exports={validateSignupData,validateEditProfile};

