import {Request, Response, Router} from 'express';
import {authenticated} from '../middlewares/authenticated';
import {authorizedWithRole} from '../middlewares/authorizedWithRole';
import SuccessResponse from '../helpers/SuccessResponse';
import ErrorResponse from '../helpers/ErrorResponse';
import {sessionService} from '../services/sessionService';

const router = Router();

router.get('/:classroomId', authenticated, authorizedWithRole('ROLE_STUDENT'), async (req: Request, res: Response) => {
    try {
        const sessions = await sessionService.getAllForClassroom(req.params.classroomId);
        res.status(200);
        res.json(new SuccessResponse(sessions));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.post('/:classroomId', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const created = await sessionService.createSession(req.params.classroomId, req.body);
        res.status(201);
        res.json(new SuccessResponse(created));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.get('/:classroomId/:id', authenticated, authorizedWithRole('ROLE_STUDENT'), async (req: Request, res: Response) => {
    try {
        const session = await sessionService.getById(req.params.id);
        res.status(200);
        res.json(new SuccessResponse(session));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.put('/:classroomId/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const session = await sessionService.update(req.params.id, req.body);
        res.status(200);
        res.json(new SuccessResponse(session));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.delete('/:classroomId/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const deleted = await sessionService.delete(req.params.classroomId, req.params.id);
        res.status(200);
        res.json(new SuccessResponse(deleted));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

export default router;
