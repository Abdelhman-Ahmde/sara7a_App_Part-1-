import mongoose from "mongoose";
import { genderEnum, providerEnum, roleEnum } from "../../Utils/enums/user.enum.js";

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "firstName is required"],
        minlength: [3, "firstName must be at least 3 characters long"],
        maxlength: [20, "firstName must be at most 20 characters long"]
    },
    lastName: {
        type: String,
        required: [true, "lastName is required"],
        minlength: [3, "lastName must be at least 3 characters long"],
        maxlength: [20, "lastName must be at most 20 characters long"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: function () {
            return this.provider === providerEnum.System;
        },
    },
    DOB: Date,
    phone: String,
    gender: {
        type: Number,
        enum: Object.values(genderEnum),
        default: genderEnum.MALE
    },
    role: {
        type: Number,
        enum: Object.values(roleEnum),
        default: roleEnum.USER
    },
    provider: {
        type: Number,
        enum: Object.values(providerEnum),
        default: providerEnum.System
    },
    confirmEmail: Date,
    profileImage: String,

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.virtual("fullName").set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
}).get(function () {
    return `${this.firstName} ${this.lastName}`;
})

const UserModel = mongoose.model("user", userSchema);
export default UserModel;