/// <reference path="../../typings/tsd.d.ts"/>
import {Request, Response, Router} from 'express';
import {authenticated} from '../middlewares/authenticated';
import {authorizedWithRole} from '../middlewares/authorizedWithRole';
import {upload} from '../middlewares/uploader';
import {lessonService} from '../services/lessonService';
import ErrorResponse from '../helpers/ErrorResponse';
import SuccessResponse from '../helpers/SuccessResponse';
import Lesson from '../models/Lesson';

const router = Router();

router.get('/', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    lessonService.getAllLessons().then(
        (lessons: Lesson[]) => {
            res.status(200);
            res.json(new SuccessResponse(lessons));
        },
        (err: Object) => {
            res.status(400);
            res.json(new ErrorResponse(err));
        }
    );
});

router.post('/', authenticated, authorizedWithRole('ROLE_TEACHER'), upload.any(), (req: Request, res: Response) => {
    lessonService.addLesson(req.body, req.files).then(
        (lessonId: string) => {
            res.status(201);
            res.json(new SuccessResponse(lessonId));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.get('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    lessonService.getById(req.params.id).then(
        (lesson: Lesson) => {
            res.status(200);
            res.json(new SuccessResponse(lesson));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.put('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), upload.any(), (req: Request, res: Response) => {
    res.json('update');
});

router.delete('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    res.json('delete');
});

export default router;
