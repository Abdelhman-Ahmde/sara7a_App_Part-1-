import { Types } from "mongoose";
import { BadRequestException } from "../Utils/response/error.response.js";
import joi from "joi";
import { genderEnum, providerEnum, roleEnum } from "../Utils/enums/user.enum.js";
export const generalFields = {
    firstName: joi
        .string()
        .alphanum()
        .min(3)
        .max(25)
        .messages({
            'string.min': 'First name must be at least 3 characters long',
            'string.max': 'First name must be at most 25 characters long',
            'any.required': 'First name is required'
        }),
    lastName: joi
        .string()
        .alphanum()
        .min(3)
        .max(25)
        .messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 3 characters long',
            'string.max': 'Last name must be at most 25 characters long',
            'any.required': 'Last name is required'
        }),
    email: joi
        .string()
        .email({
            minDomainSegments: 1,
            maxDomainSegments: 3,
            tlds: { allow: ["com", "org", "net", "edu"] }
        })
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required'
        }),
    password: joi
        .string()
        .min(8)
        .max(20)
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must be at most 20 characters long',
            'any.required': 'Password is required'
        }),
    confirmPassword: joi
        .string()
        .valid(joi.ref('password'))
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm password is required'
        }),
    phone: joi
        .string()
        .pattern(/^01[0,1,2,5][0-9]{8}$/)
        .messages({
            'string.pattern': 'Phone number must be a valid Egyptian phone number',
        }),
    age: joi
        .number()
        .positive()
        .min(18)
        .max(100)
        .messages({
            'number.min': 'Age must be at least 18 years old',
            'number.max': 'Age must be at most 100 years old',
            'any.required': 'Age is required'
        }),
    gender: joi.string().valid(...Object.values(genderEnum)).messages({'any.only': 'Gender must be male or female'}),
    id: joi.string().custom((value,helpers)=>{
        return (
            Types.ObjectId.isValid(value) ||  helpers.message("Invalid Object Format")
        );
    }),
    provider: joi.string().valid(...Object.values(providerEnum)).messages({'any.only': 'Provider must be valid'}),
    role: joi.string().valid(...Object.values(roleEnum)).messages({'any.only': 'Role must be valid'}),
    file: {
        fieldname: joi.string(),
        originalname: joi.string(),
        encoding: joi.string(),
        mimetype: joi.string(),
        size: joi.number().positive(),
        destination: joi.string(),
        filename: joi.string(),
        path: joi.string(),
        fieldPath: joi.string()
    }
}


export const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const valiationErorr = [];

        for (const key of Object.keys(schema)) {
            const valiationResult = schema[key].validate(req[key], { abortEarly: false });
            if (valiationResult.error) {
                valiationErorr.push({ key, details: valiationResult.error.details })
            }
        }
        if (valiationErorr.length > 0) {
            throw BadRequestException({ message: "valiationErorr", extra: valiationErorr })
        }
        return next();
    }
}