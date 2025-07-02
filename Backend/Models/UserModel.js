import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
    },

    lastName: String,

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true,
    },
    history: [
        {
            fileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ExcelRecord',
            },
            action: {
                type: String,
                enum: ['view', 'download'],
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],


}, { timestamps: true })

const UserModel = mongoose.model("UserModel", userSchema);
export default UserModel
