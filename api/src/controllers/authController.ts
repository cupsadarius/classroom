/// <reference path="../../typings/tsd.d.ts"/>
import {Request, Response, Router} from 'express';
import {authService} from '../services/authService';
import ErrorResponse from '../helpers/ErrorResponse';
import SuccessResponse from '../helpers/SuccessResponse';
import {authenticated} from '../helpers/midlewares/authenticated';
import {authorizedWithRoleUser} from '../helpers/midlewares/authorizedWithRole';
const router = Router();

/* GET home page. */
router.post('/authenticate', (req: Request, res: Response) => {
    authService.authenticate(req.body).then(
        (token: string) => {
            res.status(200);
            res.json(new SuccessResponse(token));
        },
        (error: Object) => {
            res.status(401);
            res.json(new ErrorResponse(error));
        }
    );
});

router.get('/current-user', authenticated, authorizedWithRoleUser, (req: Request, res: Response) => {
    if (req.user) {
        res.status(200);
        res.json(new SuccessResponse(req.user));
    } else {
        res.status(400);
        res.json(new ErrorResponse('Something went wrong.'));
    }
});

router.get('/logout', (req: Request, res: Response) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    authService.blacklistToken(token).then(
        () => {
            res.status(200);
            res.json(new SuccessResponse('Successfully logged out.'));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

export default router;
