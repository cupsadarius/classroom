/// <reference path="../../typings/tsd.d.ts"/>
import {Router} from 'express';
import defaultController from '../controllers/defaultController';

const router = Router();

// load modules
router.use('/', defaultController);

export default router;
