import * as multer from 'multer';
import {Request} from 'express';
import FileMapping from '../db/mappers/mappings/FileMapping';
import * as path from 'path';

const storage = multer.diskStorage({
    destination: (req: Request, file: FileMapping, cb: Function) => {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: (req: Request, file: FileMapping, cb: Function) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000,
        files: 100,
    }
});