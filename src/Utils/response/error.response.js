
/// This function is used to send an error response to the client
export const ErrorResponse = ({message = "Something went wrong",status = 400 , extra = undefined}) => {
    const error = new Error(typeof message === "string" ? message : "Something went wrong");
    error.status = status;
    error.extra = extra;
    throw error;
}
// This function is used to send a bad request response to the client
export const BadRequestException = ({message = "BadRequestException", extra = undefined}) => {
    return ErrorResponse({message, status: 400, extra});
};
// This function is used to send an unauthorized response to the client
export const UnauthorizedException = ({message = "UnauthorizedException", extra = undefined}) => {
    return ErrorResponse({message, status: 401, extra});
};
// This function is used to send a Conflict request response to the client
export const ConflictException = ({message = "ConflictException", extra = undefined}) => {
    return ErrorResponse({message, status: 409, extra});
};
// This function is used to send a Not Found request response to the client
export const NotFoundException = ({message = "NotFoundException", extra = undefined}) => {
    return ErrorResponse({message, status: 404, extra});
};
// This function is used to send a Internal Server Error request response to the client
export const InternalServerErrorException = ({message = "InternalServerErrorException", extra = undefined}) => {
    return ErrorResponse({message, status: 500, extra});
};
// This function is used to send a Forbidden request response to the client
export const ForbiddenException = ({message = "ForbiddenException", extra = undefined}) => {
    return ErrorResponse({message, status: 403, extra});
};

// This function is used to handle all errors in the application
export const GlobalErrorHandler = (err, req, res, next) => {
    const status = err.status ?? 500;
    return res.status(status).json({message: err.message, stack : err.stack, status , extra: err.extra});
}