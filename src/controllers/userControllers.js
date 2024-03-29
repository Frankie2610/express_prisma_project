import { PrismaClient } from '@prisma/client'
import { checkToken } from '../config/jwt.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

// lấy thông tin user
const getUserInfo = async (req, res) => {
    const { token } = req.headers;
    const { user_id } = checkToken(token).data
    try {
        const userInfo = await prisma.nguoi_dung.findFirst(
            {
                where: {
                    nguoi_dung_id: +user_id
                }
            }
        )
        res.status(200).send(userInfo)
    } catch (err) {
        res.send(`Error: ${err}`)
    }
}

// lấy danh sách ảnh đã lưu theo user_id
const getStoredPhotoList = async (req, res) => {
    const { token } = req.headers;
    const { user_id } = checkToken(token).data
    try {
        const storedPhotoList = await prisma.luu_anh.findMany({
            where: {
                nguoi_dung_id: +user_id
            }
        })
        res.status(200).send(storedPhotoList)
    } catch (err) {
        res.send(`Error: ${err}`)
    }
}

// lấy danh sách ảnh đã tạo theo user_id
const getPostedPhotoList = async (req, res) => {
    const { token } = req.headers;
    const { user_id } = checkToken(token).data
    try {
        const photo = await prisma.hinh_anh.findMany({
            where: {
                nguoi_dung_id: +user_id
            }
        })
        res.status(200).send(photo)
    } catch (err) {
        res.send(`Error: ${err}`)
    }
}

// update thông tin cá nhân của user
const updateUser = async (req, res) => {
    const { token } = req.headers;
    const { user_id } = checkToken(token).data
    const { email, password, username, age, avatar } = req.body
    // encode lại password
    const encodePassword = bcrypt.hashSync(password, 10);
    try {
        const newData = {
            email: email,
            mat_khau: encodePassword,
            ho_ten: username,
            tuoi: age,
            anh_dai_dien: avatar

        }
        await prisma.nguoi_dung.update({
            where: {
                nguoi_dung_id: +user_id
            },
            data: newData
        })
        res.status(200).send("Your profile has been updated successfully!")
    } catch (err) {
        res.send(`Error: ${err}`)
    }
}

export {
    getUserInfo,
    getStoredPhotoList,
    getPostedPhotoList,
    updateUser
}