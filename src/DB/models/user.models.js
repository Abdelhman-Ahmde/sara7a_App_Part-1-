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
        unique: true,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        // يتم طلب كلمة المرور إجبارياً فقط إذا كان المستخدم يسجل عبر النظام (وليس عبر مزود خارجي مثل Google)
        required: function () {
            return this.provider == providerEnum.System;
        },
    },
    DOB: Date,
    age: Number,
    phone: String,
    gender: {
        type: Number,
        enum: Object.values(genderEnum),
        default: genderEnum.Male
    },
    role: {
        type: Number,
        enum: Object.values(roleEnum),
        default: roleEnum.User
    },
    provider: {
        type: Number,
        enum: Object.values(providerEnum),
        default: providerEnum.System
    },
    changeCredentialTime: Date,
    confirmEmail: Date,
    profileImage: String,
    coverImages: [String],

}, {
    timestamps: true,
    // إتاحة الحقول الافتراضية (Virtuals) عند تحويل المستند إلى JSON أو Object
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
