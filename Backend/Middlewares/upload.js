import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
    storage,

    limits: { fileSize: 5 * 1024 * 1024 },

    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx)$/)) {
            return cb(new Error('Only .xlsx files allowed'), false);
        }
        cb(null, true);
    },
});

export default upload;