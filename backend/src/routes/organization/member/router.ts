import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleValidationResults } from '../../middleware/validation.js';
import { requirePermission } from '../controller.js';
import { DELETE, GET, PATCH } from './controller.js';

const MemberRouter = Router({ mergeParams: true })
  // Deprecated
  .get('', requirePermission('organization.members.view'), GET)
  .patch(
    '/:userId',
    param('userId').isInt().withMessage('Invalid user ID'),
    body('roles').isArray(),
    body('roles.*').isInt().withMessage('Invalid user ID'),
    handleValidationResults,
    requirePermission('organization.members.updateRoles'),
    PATCH,
  )
  .delete(
    '/:userId',
    param('userId').isInt().withMessage('Invalid user ID'),
    handleValidationResults,
    requirePermission('organization.members.remove'),
    DELETE,
  );

export default MemberRouter;
