import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleValidationResults } from '../middleware/validation.js';
import {
  GET,
  GET_BY_ID,
  GET_BY_ID_AS_ADMIN,
  PATCH,
  createOrganization,
  requirePermission,
  requireUserBelongsToTargetOrganization,
} from './controller.js';
import ItemRouter from './item/router.js';
import MemberRouter from './member/router.js';
import RoleRouter from './role/router.js';
import type { MinMaxOptions } from 'express-validator/lib/options.js';
import { REDIS_COUNTRY_CODES_SET } from '../../utils/constants.js';
import getRedis from '../../services/redis.js';
import { Permission } from '../../types/database-types.js';

const minMaxOrganizationNameLength: MinMaxOptions = { min: 1, max: 32 };
const fractionDigitsLimit: MinMaxOptions = { min: 0, max: 6 };

function createOrganizationValidatorChain() {
  return [
    body('name')
      .isLength(minMaxOrganizationNameLength)
      .withMessage(
        `Organization name must be between ${minMaxOrganizationNameLength.min} and ${minMaxOrganizationNameLength.max} characters long`,
      ),
    body('countryCode')
      .isString()
      .withMessage('Invalid country code')
      .custom((countryCode) =>
        getRedis()
          .sIsMember(REDIS_COUNTRY_CODES_SET, countryCode)
          .then((found) => {
            if (!found) throw new Error();
          }),
      )
      .withMessage('Country not found'),
    body('currencyFormat').isObject().withMessage('Currency format must be an object'),
    body([
      'currencyFormat.thousandSeparator',
      'currencyFormat.decimalSeparator',
      'currencyFormat.symbol',
    ])
      .isString()
      .withMessage((_input, meta) => `${meta.path} must be a string`),
    body('currencyFormat.isSymbolBefore')
      .isBoolean()
      .withMessage('isSymbolBefore must be a boolean')
      .toBoolean(),
    body('currencyFormat.fractionDigits')
      .isInt(fractionDigitsLimit)
      .withMessage('Fraction digits must be between 0 and 6')
      .toInt(),
  ];
}

const OrganizationRouter = Router()
  .get('', GET)
  .post('', ...createOrganizationValidatorChain(), handleValidationResults, createOrganization)
  .use(
    '/:organizationId',
    param('organizationId').isInt(),
    handleValidationResults,
    Router({ mergeParams: true })
      .use(requireUserBelongsToTargetOrganization)
      .get('', GET_BY_ID)
      .get('/admin', GET_BY_ID_AS_ADMIN)
      .patch(
        '',
        ...createOrganizationValidatorChain().map((validator) => validator.optional()),
        handleValidationResults,
        requirePermission(Permission.ORGANIZATION_EDIT),
        PATCH,
      )
      .use('/role', RoleRouter)
      .use('/member', MemberRouter)
      .use('/items', ItemRouter),
  );

export default OrganizationRouter;
