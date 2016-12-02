/// <reference path="../../typings/tsd.d.ts"/>
import {Request, Response, Router} from 'express';
import {authenticated} from '../helpers/midlewares/authenticated';
import {authorizedWithRoleUser} from '../helpers/midlewares/authorizedWithRole';
const router = Router();

/* GET home page. */
router.get('/', authenticated, authorizedWithRoleUser, (req: Request, res: Response, next: Function) => {
  res.json({message: 'Api entrypoint'});
});

export default router;
