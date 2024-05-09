import multer from 'multer';
import path from 'path';
const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/logo');
    },
    filename: function (req, file, cb) {
        cb(null, 'logo' + path.extname(file.originalname));
    }
});

const logoUpload = multer({ storage: storage1 });

export default logoUpload;
