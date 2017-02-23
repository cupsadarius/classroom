import {Request, Response, Router} from 'express';
import {authenticated} from '../middlewares/authenticated';
import {authorizedWithRole} from '../middlewares/authorizedWithRole';
import {upload} from '../middlewares/uploader';
import {lessonService} from '../services/lessonService';
import ErrorResponse from '../helpers/ErrorResponse';
import SuccessResponse from '../helpers/SuccessResponse';
const router = Router();

router.get('/', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const lessons = await lessonService.getAllLessons();
        res.status(200);
        res.json(new SuccessResponse(lessons));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.post('/', authenticated, authorizedWithRole('ROLE_TEACHER'), upload.any(), async (req: Request, res: Response) => {
    try {
        const lessonId = await lessonService.saveLesson(req.body, req.files['slide']);
        res.status(201);
        res.json(new SuccessResponse(lessonId));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.get('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const lesson = await lessonService.getById(req.params.id);
        res.status(200);
        res.json(new SuccessResponse(lesson));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.put('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), upload.any(), async (req: Request, res: Response) => {
    res.json('update');
});

router.delete('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    res.json('delete');
});

export default router;
