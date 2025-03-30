const multer = require('multer');
const path = require('path');
const ApiError = require('../api-error');

// Storage cho file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'avatarFile') {
            cb(null, './public/images/'); // Lưu ảnh vào thư mục images
        } else if (file.fieldname === 'soundFile') {
            cb(null, './public/sounds/'); // Lưu nhạc vào thư mục sounds
        }
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniquePrefix + path.extname(file.originalname));
    },
});

// Khởi tạo multer với fields
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, });

const fileUpload = upload.fields([
    { name: 'avatarFile', maxCount: 1 }, // Trường cho ảnh
    { name: 'soundFile', maxCount: 1 }, // Trường cho nhạc
]);

module.exports = fileUpload;