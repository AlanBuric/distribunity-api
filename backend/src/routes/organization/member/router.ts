import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleValidationResults } from '../../middleware/validation.js';
import { requirePermission } from '../controller.js';
import { DELETE, GET, PATCH } from './controller.js';
import { Permission } from '../../../types/database-types.js';

const MemberRouter = Router({ mergeParams: true })
  // Deprecated
  .get('', requirePermission(Permission.ORGANIZATION_MEMBERS_VIEW), GET)
  .patch(
    '/:userId',
    param('userId').isInt().withMessage('Invalid user ID'),
    body('roles').isArray(),
    body('roles.*').isInt().withMessage('Invalid user ID'),
    handleValidationResults,
    requirePermission(Permission.ORGANIZATION_MEMBERS_UPDATE_ROLES),
    PATCH,
  )
  .delete(
    '/:userId',
    param('userId').isInt().withMessage('Invalid user ID'),
    handleValidationResults,
    requirePermission(Permission.ORGANIZATION_MEMBERS_REMOVE),
    DELETE,
  );

export default MemberRouter;
