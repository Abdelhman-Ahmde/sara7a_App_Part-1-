import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";

export const signupSchema = {
    body: joi.object({
        firstName: generalFields.firstName.required(),
        lastName: generalFields.lastName.required(),
        email: generalFields.email.required(),
        password: generalFields.password.required(),
        confirmPassword: generalFields.confirmPassword.required(),
        phone: generalFields.phone.required(),
        age: generalFields.age,
        gender: generalFields.gender,
    })
}

export const loginSchema = {
    body: joi.object({
        email: generalFields.email.required(),
        password: generalFields.password.required()
    })
}

