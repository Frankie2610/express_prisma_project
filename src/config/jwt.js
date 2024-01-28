import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const createToken = (data) => {
    return jwt.sign(data, "NODE38_CAPSTONE", { expiresIn: "1y" })
}

const checkToken = (token) => {
    return jwt.verify(token, "NODE38_CAPSTONE", (err, decoded) => {
        if (err) {
            return {
                statusCode: 401,
                message: "Invalid Token"
            }
        }
        return {
            statusCode: 200,
            data: decoded
        }
    })
}

const apiKey = async (req, res, next) => {
    const { token } = req.headers;
    if (token) {
        const verifyToken = checkToken(token);
        if (verifyToken.statusCode == 401) {
            res.status(verifyToken.statusCode).send(verifyToken.message)
            return;
        }
        const { user_id } = verifyToken.data
        const checkUser = await prisma.nguoi_dung.findMany(
            {
                where: {
                    nguoi_dung_id: user_id
                }
            }
        )
        if (!checkUser) {
            res.status(401).send("Invalid token")
            return
        }
        next()

    } else {
        res.status(401).send("Unauthorized");
        return
    }
}

export {
    createToken,
    checkToken,
    apiKey
}