import { signatureEnum, tokenTypeEnum } from "../Utils/enums/user.enum.js";
import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from "../Utils/response/error.response.js";
import { generateToken, getSignature, verifyToken } from "../Utils/tokens/token.js";
import { findById, findOne } from "../DB/database.repositry.js";
import UserModel from "../DB/models/user.models.js";
import TokenModel from "../DB/models/token.models.js";
import { get, logoutAllKey, revokeTokenKey } from "../DB/redis.service.js";


//Decode Token Middleware To access user 
export const decodeTokenAccess = async ({ authorization, tokenType = tokenTypeEnum.Access }) => {
    const [Bearer, token] = authorization.split(" ") || [];
    if (!Bearer || !token)
        throw BadRequestException({ message: "Authorization token is missing or invalid" });
    let signature = await getSignature({ signatureLevel: signatureEnum[`${Bearer}`] });
    const decodedToken = await verifyToken({
        token,
        secretKey: tokenType === tokenTypeEnum.Access
            ? signature.accessSignature
            : signature.refreshSignature
    });
    // check if token is revoked
    // const isTokenRevoked = await findOne({ model: TokenModel, filter: { jti: decodedToken.jti } });
    // if (isTokenRevoked)
    //     throw UnauthorizedException({ message: "Token is revoked" });

    const isTokenRevoked = await get({ key: revokeTokenKey({ userId: decodedToken.id, jti: decodedToken.jti }) });
    if (isTokenRevoked)
        throw UnauthorizedException({ message: "Token is revoked" });

    const redisLogoutAllTime = await get({ key: logoutAllKey({ userId: decodedToken.id }) });

    if (redisLogoutAllTime) {
        const changeTime = parseInt(redisLogoutAllTime);
        if (changeTime > decodedToken.iat * 1000) {
            throw UnauthorizedException({ message: "You need to login again (All devices logged out)" });
        }
    }

    const user = await findById({ model: UserModel, id: decodedToken.id });
    if (!user)
        throw NotFoundException({ message: "User not found" });

    // // check if user changed credentials
    // if (user.changeCredentialTime || 0 > decodedToken.iat * 1000)
    //     throw UnauthorizedException({ message: "You need to login again" });

    return { user, decodedToken };
}

//Access Token Middleware
export const authenticationAccess = ({ tokenType = tokenTypeEnum.Access }) => {
    return async (req, res, next) => {
        const { user, decodedToken } = await decodeTokenAccess({ authorization: req.headers.authorization, tokenType }) || {};
        req.user = user;
        req.decodedToken = decodedToken;
        return next();
    }
}

//Authorization Middleware to access specific roles
export const authorization = ({ accessRoles = [] }) => {
    return async (req, res, next) => {
        if (!accessRoles.includes(req.user.role))
            throw ForbiddenException({ message: "You are not authorized to access this resource" });
        return next();
    }
}

//Decode Token Middleware To refresh user
export const decodeTokenRefresh = async ({ authorization, tokenType = tokenTypeEnum.Refresh }) => {
    const [Bearer, token] = authorization.split(" ");
    if (!Bearer || !token)
        throw BadRequestException({ message: "Authorization token is missing or invalid" });
    let signature = await getSignature({ signatureLevel: Bearer });
    const decodedToken = await verifyToken({
        token, secretKey: tokenType === tokenTypeEnum.Refresh
            ? signature.refreshSignature
            : signature.accessSignature
    });
    const user = await findById({ model: UserModel, id: decodedToken.id });
    if (!user)
        throw NotFoundException({ message: "User not found" });
    const accessToken = await generateToken({
        payload: { id: user._id, email: user.email },
    })
    return { accessToken };
}

//Refresh Token Middleware
export const authenticationRefresh = ({ tokenType = tokenTypeEnum.Refresh }) => {
    return async (req, res, next) => {
        const { accessToken } = await decodeTokenRefresh({ authorization: req.headers.authorization, tokenType }) || {};
        req.accessToken = accessToken;
        return next();
    }
}

