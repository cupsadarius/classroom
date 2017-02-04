/// <reference path="../../typings/tsd.d.ts"/>
import {Router} from 'express';
import defaultController from '../controllers/defaultController';
import userController from '../controllers/userController';
import teacherController from '../controllers/teacherController';
import studentController from '../controllers/studentController';
import authController from '../controllers/authController';
import lessonController from '../controllers/lessonController';
import categoryController from '../controllers/categoryController';
const router = Router();

// load modules
router.use('/user', userController);
router.use('/attendee/teacher', teacherController);
router.use('/attendee/student', studentController);
router.use('/lesson', lessonController);
router.use('/category', categoryController);
router.use('/', authController);
router.use('/', defaultController);

export default router;
