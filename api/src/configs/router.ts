import {Router} from 'express';
import defaultController from '../controllers/defaultController';
import userController from '../controllers/userController';
import teacherController from '../controllers/teacherController';
import studentController from '../controllers/studentController';
import authController from '../controllers/authController';
import lessonController from '../controllers/lessonController';
import categoryController from '../controllers/categoryController';
import classroomController from '../controllers/classroomController';

const router = Router();

/**
 * Agregates all the controllers.
 */
router.use('/user', userController);
router.use('/attendee/teacher', teacherController);
router.use('/attendee/student', studentController);
router.use('/lesson', lessonController);
router.use('/category', categoryController);
router.use('/classroom', classroomController);
router.use('/', authController);
router.use('/', defaultController);

export default router;