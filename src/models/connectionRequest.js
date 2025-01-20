const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: '{VALUE} is an incorrect status type',
        },
    },
}, { timestamps: true });

// Prevent users from sending connection requests to themselves
connectionRequestSchema.pre("save", function (next) {
    const connection = this;
    if (connection.fromUserId.equals(connection.toUserId)) {
        return next(new Error("You cannot send a request to yourself"));
    }
    next();
});

// Optionally, add a unique index to prevent multiple requests between the same users
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

module.exports = mongoose.model("Connection", connectionRequestSchema);
