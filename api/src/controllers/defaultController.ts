/// <reference path="../../typings/tsd.d.ts"/>
import {Request, Response, Router} from 'express';
const router = Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: Function) => {
  res.json({message: 'Api entrypoint'});
});

export default router;
