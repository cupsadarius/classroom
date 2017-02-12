import * as multer from 'multer';

import * as path from 'path';
export const upload = multer({
    dest: path.join(__dirname, '../../public/uploads'),
    limits: {
        fileSize: 10000000,
        files: 20,
    }
});