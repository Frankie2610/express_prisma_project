import express from "express";
import { addPhoto, createComment, deletePostedPhoto, getComment, getPhotoInfo, getPhotoList, getStoredPhoto, searchPhotoList } from "../controllers/photoControllers.js";
import { apiKey } from "../config/jwt.js";


const photoRoutes = express.Router()

photoRoutes.get("/get-photo-list", apiKey, getPhotoList)
photoRoutes.get("/search-photo/:photoName", apiKey, searchPhotoList)
photoRoutes.get("/get-photo-info/:photoId", apiKey, getPhotoInfo)
photoRoutes.get("/get-comment/:photoId", apiKey, getComment)
photoRoutes.get("/get-stored-photo/:photoId", apiKey, getStoredPhoto)
photoRoutes.post("/create-comment/:photoId", apiKey, createComment)
photoRoutes.delete("/delete-photo/:photoId", apiKey, deletePostedPhoto)
photoRoutes.post("/add-photo", apiKey, addPhoto)

export default photoRoutes