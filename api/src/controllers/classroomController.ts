import {Request, Response, Router} from 'express';
import {authenticated} from '../middlewares/authenticated';
import {authorizedWithRole} from '../middlewares/authorizedWithRole';
import SuccessResponse from '../helpers/SuccessResponse';
import ErrorResponse from '../helpers/ErrorResponse';
import {classroomService} from '../services/classroomService';
const router = Router();

/**
 * Classroom controller
 */

router.get('/', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const classrooms = await classroomService.getAllByAttendee(req.user.id);
        res.status(200);
        res.json(new SuccessResponse(classrooms));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.post('/', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const classroomId = await classroomService.createClassroom(req.body);
        res.status(201);
        res.json(new SuccessResponse(classroomId));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.get('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const classroom = await classroomService.getById((req.params.id));
        res.status(200);
        res.json(new SuccessResponse(classroom));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.put('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const classroom = await classroomService.update(req.params.id, req.body);
        res.status(200);
        res.json(new SuccessResponse(classroom));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.delete('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        await classroomService.delete(req.params.id);
        res.status(200);
        res.json(new SuccessResponse(''));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

export default router;
