/// <reference path="../../typings/tsd.d.ts"/>
import {Request, Response, Router} from 'express';
import {userService} from '../services/userService';
import SuccessResponse from '../helpers/SuccessResponse';
import ErrorResponse from '../helpers/ErrorResponse';
import {authenticated} from '../helpers/midlewares/authenticated';
import {authorizedWithRoleUser, authorizedWithRoleAdmin} from '../helpers/midlewares/authorizedWithRole';
import User from '../models/User';
const router = Router();

/* GET home page. */
router.get('/', authenticated, authorizedWithRoleAdmin , (req: Request, res: Response) => {
    userService.getUsers().then(
        (users: User[]) => {
            res.status(200);
            res.json(new SuccessResponse(users));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.post('/', (req: Request, res: Response) => {
    userService.saveUser(req.body).then(
        (userId: string) => {
            res.status(200);
            res.json(new SuccessResponse(userId));
        },
        (error) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.get('/:id', authenticated, authorizedWithRoleUser, (req: Request, res: Response) => {
    userService.getById(req.params.id).then(
        (user: User) => {
            res.status(200);
            res.json(new SuccessResponse(user));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.put('/:id', authenticated, authorizedWithRoleUser, (req: Request, res: Response) => {
    userService.update(req.params.id, req.body).then(
        (user: User) => {
            res.status(200);
            res.json(new SuccessResponse(user));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.delete('/:id', authenticated, authorizedWithRoleUser, (req: Request, res: Response) => {
    userService.delete(req.params.id).then(
        () => {
            res.status(200);
            res.end();
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

export default router;
