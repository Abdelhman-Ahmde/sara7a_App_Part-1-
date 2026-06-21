export const ErrorResponse = ({ message = "Something went wrong", status = 400, extra = undefined }) => {
    const error = new Error(typeof message === "string" ? message : "Something went wrong");
    error.status = status;
    error.extra = extra;
    throw error;
}


export const BadRequestException = ({ message = "BadRequestException", extra = undefined }) => {
    return ErrorResponse({ message, status: 400, extra });
};


export const UnauthorizedException = ({ message = "UnauthorizedException", extra = undefined }) => {
    return ErrorResponse({ message, status: 401, extra });
};


export const ConflictException = ({ message = "ConflictException", extra = undefined }) => {
    return ErrorResponse({ message, status: 409, extra });
};


export const NotFoundException = ({ message = "NotFoundException", extra = undefined }) => {
    return ErrorResponse({ message, status: 404, extra });
};


export const InternalServerErrorException = ({ message = "InternalServerErrorException", extra = undefined }) => {
    return ErrorResponse({ message, status: 500, extra });
};


export const ForbiddenException = ({ message = "ForbiddenException", extra = undefined }) => {
    return ErrorResponse({ message, status: 403, extra });
};


export const GlobalErrorHandler = (err, req, res, next) => {
    const status = err.status ?? 500;
    const extra = err.extra ?? undefined;
    return res.status(status).json({ message: err.message, stack: err.stack, status, extra });
}
