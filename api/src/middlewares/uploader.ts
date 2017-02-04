/// <reference path="../../typings/tsd.d.ts"/>
import * as multer from 'multer';

export let upload =  multer({
    dest: `${__dirname}/../../../../public/uploads`,
    limits: {
        fileSize: 10000000,
        files: 20,
    },
});
