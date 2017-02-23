import {Request, Response, Router} from 'express';
import {authenticated} from '../middlewares/authenticated';
import {authorizedWithRole} from '../middlewares/authorizedWithRole';
const router = Router();

router.get('/', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    res.json('');
});

router.post('/', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    res.json('');
});

router.get('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    res.json('');
});

router.put('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    res.json('');
});

router.delete('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    res.json('');
});

export default router;
