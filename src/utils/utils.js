const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

const errorResponse = (res, statusCode, message) => {
    res.status(statusCode).json(
        {
            success: false,
            message
        }
    );
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const uploadFile = multer({ storage: multer.memoryStorage() });


const streamUpload = (req, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder,
            resource_type: 'auto'
        },
        (error, result) => {
            if(result) resolve(result);
            else reject(error)
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
}


module.exports = {
    errorResponse,
    uploadFile,
    streamUpload,
}