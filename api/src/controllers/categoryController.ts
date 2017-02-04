/// <reference path="../../typings/tsd.d.ts"/>
import {Request, Response, Router} from 'express';
import {authenticated} from '../middlewares/authenticated';
import {authorizedWithRole} from '../middlewares/authorizedWithRole';
import {categoryService} from '../services/categoryService';
import ErrorResponse from '../helpers/ErrorResponse';
import SuccessResponse from '../helpers/SuccessResponse';
import Category from '../models/Category';

const router = Router();

router.get('/', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    categoryService.getAllCategories().then(
        (categories: Category[]) => {
            res.status(200);
            res.json(new SuccessResponse(categories));
        },
        (err: Object) => {
            res.status(400);
            res.json(new ErrorResponse(err));
        }
    );
});

router.post('/', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    categoryService.addCategory(req.body).then(
        (categoryId: string) => {
            res.status(201);
            res.json(new SuccessResponse(categoryId));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.get('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    categoryService.getById(req.params.id).then(
        (category: Category) => {
            res.status(200);
            res.json(new SuccessResponse(category));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.put('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    categoryService.update(req.params.id, req.body).then(
        (category: Category) => {
            res.status(200);
            res.json(new SuccessResponse(category));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

router.delete('/:id', authenticated, authorizedWithRole('ROLE_TEACHER'), (req: Request, res: Response) => {
    categoryService.delete(req.params.id).then(
        () => {
            res.status(200);
            res.json(new SuccessResponse(''));
        },
        (error: Object) => {
            res.status(400);
            res.json(new ErrorResponse(error));
        }
    );
});

export default router;
