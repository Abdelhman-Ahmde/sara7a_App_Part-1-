import { redisClient } from "./redis.connection.js";

//revoke Token Key Prefix
export const revokeTokenKeyPrefix = ({ userId }) => {
    return `user:revokeToken:${userId}`;
};

//logoutAll Key Prefix
export const logoutAllKeyPrefix = ({ userId }) => {
    return `user:logoutAllTime:${userId}`;
};

//logoutAll Key
export const logoutAllKey = ({ userId }) => {
    return `${logoutAllKeyPrefix({ userId })}`;
};

//revoke Token Key
export const revokeTokenKey = ({ userId, jti }) => {
    return `${revokeTokenKeyPrefix({ userId })}:${jti}`;
};


// set key in redis
export const set = async ({ key, value, ttl = null }) => {
    try {
        const data = typeof value != "string" ? JSON.stringify(value) : value;
        if (ttl) {
            return await redisClient.set(key, data, {
                expiration: { type: "EX", value: ttl }
            });
        } else {
            return await redisClient.set(key, data);
        }
    } catch (error) {
        console.log("Error setting key:", error);
    }
}

// get key from redis
export const get = async ({ key }) => {
    try {
        const data = await redisClient.get(key);
        return data;
    } catch (error) {
        console.log("Error getting key:", error);
    }
}

// delete key from redis
export const del = async ({ key }) => {
    try {
        const isExists = await exists({ key });
        if (!isExists) {
            throw new Error("Key does not exist");
        }
        return await redisClient.del(key);
    } catch (error) {
        console.log("Error deleting key:", error);
    }
}

// check if key exists in redis
export const exists = async ({ key }) => {
    try {
        const data = await redisClient.exists(key);
        return data;
    } catch (error) {
        console.log("Error checking key:", error);
    }
}

// update key in redis
export const update = async ({ key, value, ttl = null }) => {
    try {
        const isExists = await exists({ key });
        if (!isExists) {
            throw new Error("Key does not exist");
        }
        const data = typeof value != "string" ? JSON.stringify(value) : value;
        if (ttl) {
            return await redisClient.set(key, data, {
                expiration: { type: "EX", value: ttl }
            });
        } else {
            return await redisClient.set(key, data);
        }
    } catch (error) {
        console.log("Error updating key:", error);
    }
}

//expire key in redis
export const expire = async ({ key, ttl }) => {
    try {
        const isExists = await exists({ key });
        if (!isExists) {
            throw new Error("Key does not exist");
        }
        return await redisClient.expire(key, ttl);
    } catch (error) {
        console.log("Error expiring key:", error);
    }
}

// get ttl of key in redis
export const ttl = async ({ key }) => {
    try {
        const isExists = await exists({ key });
        if (!isExists) {
            throw new Error("Key does not exist");
        }
        return await redisClient.ttl(key);
    } catch (error) {
        console.log("Error getting ttl of key:", error);
    }
}

// get keys in redis
export const keys = async ({ pattern }) => {
    try {
        return await redisClient.keys(pattern);
    } catch (error) {
        console.log("Error getting keys:", error);
    }
}
