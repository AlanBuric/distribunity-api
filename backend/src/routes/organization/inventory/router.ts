import { Router } from 'express';
import { body, param } from 'express-validator';
import type { MinMaxOptions } from 'express-validator/lib/options.js';
import { handleValidationResults } from '../../middleware/validation.js';
import { requirePermission } from '../controller.js';
import { DELETE, GET, GET_BY_ID, PATCH, POST } from './controller.js';
import { Permission } from '../../../types/database-types.js';

const minMaxInventoryNameLength: MinMaxOptions = { min: 1, max: 32 };
const nameValidator = body('name')
  .isLength(minMaxInventoryNameLength)
  .withMessage(
    `Inventory name needs to be between ${minMaxInventoryNameLength.min} and ${minMaxInventoryNameLength.max} characters long`,
  );
const inventoryIdValidator = param('inventoryId').isInt().withMessage('Invalid inventory ID');

const InventoryRouter = Router({ mergeParams: true })
  .get('', requirePermission(Permission.INVENTORY_VIEW), GET)
  .post(
    '',
    nameValidator,
    handleValidationResults,
    requirePermission(Permission.INVENTORY_CREATE),
    POST,
  )
  .get(
    '/:inventoryId',
    inventoryIdValidator,
    handleValidationResults,
    requirePermission(Permission.INVENTORY_VIEW),
    GET_BY_ID,
  )
  .patch(
    '/:inventoryId',
    inventoryIdValidator,
    nameValidator,
    handleValidationResults,
    requirePermission(Permission.INVENTORY_EDIT),
    PATCH,
  )
  .delete(
    '/:inventoryId',
    inventoryIdValidator,
    handleValidationResults,
    requirePermission(Permission.INVENTORY_DELETE),
    DELETE,
  );

export default InventoryRouter;
