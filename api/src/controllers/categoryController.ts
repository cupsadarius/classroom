import {Request, Response, Router} from 'express';
import {authenticated} from '../middlewares/authenticated';
import {authorizedWithRole} from '../middlewares/authorizedWithRole';
import {categoryService} from '../services/categoryService';
import ErrorResponse from '../helpers/ErrorResponse';
import SuccessResponse from '../helpers/SuccessResponse';
import Category from '../models/Category';

const router = Router();

router.get('/', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200);
        res.json(new SuccessResponse(categories));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.post('/', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const id = await categoryService.addCategory(req.body);
        res.status(201);
        res.json(new SuccessResponse(id));

    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));

    }
});

router.get('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const category = await categoryService.getById(req.params.id);
        res.status(200);
        res.json(new SuccessResponse(category));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.put('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        res.status(200);
        res.json(new SuccessResponse(category));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

router.delete('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), async (req: Request, res: Response) => {
    try {
        await categoryService.delete(req.params.id);
        res.status(200);
        res.json(new SuccessResponse(''));
    } catch (e) {
        res.status(400);
        res.json(new ErrorResponse(e));
    }
});

export default router;
