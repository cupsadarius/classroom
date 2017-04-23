import {Request, Response, Router} from 'express';
import {attendeeService} from '../services/attendeeService';
import SuccessResponse from '../helpers/SuccessResponse';
import ErrorResponse from '../helpers/ErrorResponse';
import {authenticated} from '../middlewares/authenticated';
import {authorizedWithRole} from '../middlewares/authorizedWithRole';
const router = Router();

/** 
 * Teacher controller
 */

router.get('/', authenticated, authorizedWithRole('ROLE_TEACHER') , async (req: Request, res: Response) => {
    try {
        const teachers = await attendeeService.getAttendees(true);
        res.status(200);
        res.json(new SuccessResponse(teachers));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const id = await attendeeService.saveAttendee(req.body, true);
        res.status(201);
        res.json(new SuccessResponse(id));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.get('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const teacher = await attendeeService.getById(req.params.id);
        res.status(200);
        res.json(new SuccessResponse(teacher));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.put('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const teacher = await attendeeService.update(req.params.id, req.body);
        res.status(200);
        res.json(new SuccessResponse(teacher));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.delete('/:id', authenticated, authorizedWithRole('ROLE_ADMIN'), async (req: Request, res: Response) => {
    try {
        await attendeeService.delete(req.params.id);
        res.status(200);
        res.json(new SuccessResponse(''));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

export default router;
