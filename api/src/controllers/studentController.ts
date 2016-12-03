/// <reference path="../../typings/tsd.d.ts"/>
import {Request, Response, Router} from 'express';
import {attendeeService} from '../services/attendeeService';
import SuccessResponse from '../helpers/SuccessResponse';
import ErrorResponse from '../helpers/ErrorResponse';
import {authenticated} from '../helpers/midlewares/authenticated';
import {authorizedWithRole} from '../helpers/midlewares/authorizedWithRole';
import Attendee from '../models/Attendee';
const router = Router();

router.get('/', authenticated, authorizedWithRole('ROLE_TEACHER') , (req: Request, res: Response) => {
    attendeeService.getAttendees().then(
        (teachers: Attendee[]) => {
            res.status(200);
            res.json(new SuccessResponse(teachers));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.post('/', (req: Request, res: Response) => {
    attendeeService.saveAttendee(req.body).then(
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

router.get('/:id', authenticated, authorizedWithRole('ROLE_STUDENT'), (req: Request, res: Response) => {
    attendeeService.getById(req.params.id).then(
        (teacher: Attendee) => {
            res.status(200);
            res.json(new SuccessResponse(teacher));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.put('/:id', authenticated, authorizedWithRole('ROLE_STUDENT'), (req: Request, res: Response) => {
    attendeeService.update(req.params.id, req.body).then(
        (user: Attendee) => {
            res.status(200);
            res.json(new SuccessResponse(user));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.delete('/:id', authenticated, authorizedWithRole('ROLE_ADMIN'), (req: Request, res: Response) => {
    attendeeService.delete(req.params.id).then(
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
