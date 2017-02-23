import {Request, Response, Router} from 'express';
import {userService} from '../services/userService';
import SuccessResponse from '../helpers/SuccessResponse';
import ErrorResponse from '../helpers/ErrorResponse';
import {authenticated} from '../middlewares/authenticated';
import {authorizedWithRole} from '../middlewares/authorizedWithRole';
import User from '../models/User';
const router = Router();

/* GET home page. */
router.get('/', authenticated, authorizedWithRole('ROLE_ADMIN'), async (req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        res.status(200);
        res.json(new SuccessResponse(users));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.post('/', authenticated, authorizedWithRole('ROLE_ADMIN'), async (req: Request, res: Response) => {
    try {
        const id = userService.saveUser(req.body);
        res.status(200);
        res.json(new SuccessResponse(id));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(2));
    }
});

router.get('/:id', authenticated, authorizedWithRole('ROLE_ADMIN'), async (req: Request, res: Response) => {
    try {
        const user = await userService.getById(req.params.id);
        res.status(200);
        res.json(new SuccessResponse(user));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.put('/:id', authenticated, authorizedWithRole('ROLE_ADMIN'), async (req: Request, res: Response) => {
    try {
        const user = await userService.update(req.params.id, req.body);
        res.status(200);
        res.json(new SuccessResponse(user));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.delete('/:id', authenticated, authorizedWithRole('ROLE_ADMIN'), async (req: Request, res: Response) => {
    try {
        await userService.delete(req.params.id);
        res.status(200);
        res.json(new SuccessResponse(''));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

export default router;
