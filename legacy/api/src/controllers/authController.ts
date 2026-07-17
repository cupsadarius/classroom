import {Request, Response, Router} from 'express';
import {authService} from '../services/authService';
import ErrorResponse from '../helpers/ErrorResponse';
import SuccessResponse from '../helpers/SuccessResponse';
import {authenticated} from '../middlewares/authenticated';
import {authorizedWithRole} from '../middlewares/authorizedWithRole';
const router = Router();

/**
 * Auth Controller.
 */

router.post('/authenticate', async (req: Request, res: Response) => {
    try {
        const token = await authService.authenticate(req.body);
        res.status(200);
        res.json(new SuccessResponse(token));
    } catch (e) {
        res.status(401);
        res.json(new ErrorResponse(e));

    }
});

router.get('/current-user', authenticated, authorizedWithRole('ROLE_USER'), (req: Request, res: Response) => {
    if (req.user) {
        res.status(200);
        res.json(new SuccessResponse(req.user));
    } else {
        res.status(400);
        res.json(new ErrorResponse('Something went wrong.'));
    }
});

router.get('/logout', async (req: Request, res: Response) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        await authService.blacklistToken(token);
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

export default router;
