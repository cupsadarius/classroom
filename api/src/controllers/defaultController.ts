import {Request, Response, Router} from 'express';
const router = Router();

/**
 * Index controller
 */

router.get('/', (req: Request, res: Response, next: Function) => {
  res.json({message: 'Api entrypoint'});
});

export default router;
