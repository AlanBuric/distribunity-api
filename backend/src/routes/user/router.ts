import { Router } from 'express';
import { changeSelfUserPassword, deleteSelfUser, editSelfUser, getSelfUser } from './controller.js';

const UserRouter = Router()
  .get('/self', getSelfUser)
  .patch('/self', editSelfUser)
  .patch('/self/password', changeSelfUserPassword)
  .delete('/self', deleteSelfUser);

export default UserRouter;
