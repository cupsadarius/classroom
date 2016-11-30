/// <reference path="../../typings/tsd.d.ts"/>
import {Router} from 'express';
import defaultController from '../controllers/defaultController';
import userController from '../controllers/userController';

const router = Router();

// load modules
router.use('/user', userController);
router.use('/', defaultController);

export default router;
