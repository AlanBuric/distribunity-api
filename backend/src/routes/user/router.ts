import { Router } from 'express';
import { deleteSelfUser, getSelfUser } from './controller.js';
import { handleValidationResults } from '../middleware/validation.js';
import { param } from 'express-validator';

const UserRouter = Router()
  .get(
    '/:userId',
    param('userId').isInt().withMessage('Invalid user ID'),
    handleValidationResults,
    getSelfUser,
  )
  .delete('', deleteSelfUser);

export default UserRouter;
