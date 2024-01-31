import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import { createToken } from '../config/jwt.js';

const prisma = new PrismaClient()

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await prisma.nguoi_dung.findFirst(
            {
                where: {
                    email: email
                }
            }
        )

        if (data) {
            const checkPassword = bcrypt.compareSync(password, data.mat_khau)
            if (checkPassword) {
                const payload = {
                    user_id: data.nguoi_dung_id,
                    email: data.email
                }
                let token = createToken(payload);
                res.status(200).send(token);
            } else {
                res.status(400).send("Passworđ incorrect!")
            }
        } else {
            res.status(404).send("login fail!")
        }

    } catch (err) {
        res.send(`Error: ${err}`)
    }
}

const signUp = async (req, res) => {
    try {
        const { email, password, username, age, avatar } = req.body;
        const data = await prisma.nguoi_dung.findMany(
            {
                where: {
                    email: email
                    // nguoi_dung_id: nguoi_dung_id
                }
            }
        )
        console.log(data);
        if (data[0]) {
            res.status(400).send("User has existed!");
            return
        }
        const encodePassword = bcrypt.hashSync(password, 10);
        const newUser = {
            email,
            mat_khau: encodePassword,
            ho_ten: username,
            tuoi: age,
            anh_dai_dien: avatar
        }
        await prisma.nguoi_dung.create({
            data: newUser
        })
        res.status(201).send("Your account has been created!")
    } catch (err) {
        res.status(500).send(`Error: ${err}`)
    }
}

export {
    login,
    signUp
}

