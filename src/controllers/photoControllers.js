import { PrismaClient } from '@prisma/client'
import { checkToken } from '../config/jwt.js';


const prisma = new PrismaClient()

// lấy danh sách ảnh về
const getPhotoList = async (req, res) => {
    try {
        const photoList = await prisma.hinh_anh.findMany()
        res.status(200).send(photoList)
    } catch (err) {
        res.send(`Error: ${err}`)
    }
}

// tìm kiếm danh sách ảnh theo tên
const searchPhotoList = async (req, res) => {
    const { photoName } = req.params
    try {
        let photoList = await prisma.hinh_anh.findMany(
            {
                where: {
                    ten_hinh: photoName
                }
            }
        )
        res.status(200).send(photoList)
    } catch (err) {
        res.send(`Error: ${err}`)
    }
}

// lấy thông tin ảnh và người tạo ảnh bằng id ảnh
const getPhotoInfo = async (req, res) => {
    const { photoId } = req.params
    try {
        const photoInfo = await prisma.hinh_anh.findFirst(
            {
                where: {
                    hinh_id: +photoId
                },
                include: {
                    nguoi_dung: true
                }
            }
        )
        console.log(photoInfo);
        res.status(200).send(photoInfo)
    } catch (err) {
        res.send(`Error: ${err}`)
    }
}

// lấy thông tin bình luận theo id ảnh
const getComment = async (req, res) => {
    const { photoId } = req.params;
    console.log(photoId);
    try {
        const comment = await prisma.binh_luan.findMany(
            {
                where: {
                    hinh_id: +photoId
                }
            }
        )
        res.status(200).send(comment)
    } catch (err) {
        res.send(`Error: ${err}`)
    }
}

// lấy thông tin đã lưu hình này chưa theo id ảnh 
const getStoredPhoto = async (req, res) => {
    const { token } = req.headers;
    const { user_id } = checkToken(token).data
    try {
        const ISStoredPhoto = await prisma.hinh_anh.findFirst({
            where: {
                hinh_id: prisma.luu_anh.hinh_id
            }
        })
    } catch (err) {

    }
}

// lưu thông tin bình luận của người dùng với hình ảnh
const createComment = async (req, res) => {
    const { photoId } = req.params
    const { token } = req.headers;
    const { user_id } = checkToken(token).data
    const { comment } = req.body;
    try {
        const newComment = {
            nguoi_dung_id: +user_id,
            hinh_id: +photoId,
            ngay_binh_luan: new Date(),
            noi_dung: comment
        }
        await prisma.binh_luan.create({
            data: newComment
        }
        )
        res.status(201).send("Your comment has been recorded!")
    } catch (err) {
        res.send(`Error: ${err}`)
    }
}

const deletePostedPhoto = async (req, res) => {
    const { photoId } = req.params;
    const { token } = req.headers;
    const { user_id } = checkToken(token).data

    try {
        const deletedPhoto = await prisma.hinh_anh.findMany({
            where: {
                hinh_id: +photoId,
                AND: {
                    nguoi_dung_id: +user_id
                }
            }
        })

        // kiểm tra ảnh user muốn xóa có phải do user tạo
        if (!deletedPhoto[0]) {
            return res.send("Unauthorized!!")
        }

        // xóa bình luận trên ảnh
        await prisma.binh_luan.deleteMany({
            where: {
                hinh_id: +photoId
            }
        })

        // xóa ảnh trong kho lưu trữ của user
        await prisma.luu_anh.deleteMany({
            where: {
                hinh_id: +photoId,
            },
        });

        // xóa ảnh
        await prisma.hinh_anh.delete({
            where: {
                hinh_id: +photoId,
            }
        })
        res.status(200).send("Your photo has been deleted successfully!")
    } catch (err) {
        res.status(404).send(`Error: ${err}`)
    }
}

export {
    getPhotoList,
    searchPhotoList,
    getPhotoInfo,
    getComment,
    createComment,
    deletePostedPhoto
}