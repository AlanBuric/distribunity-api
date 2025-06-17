import type { Permission } from '../types/database-types.js';

export const REDIS_COUNTRY_CODES_SET = 'cc';

export const REDIS_USER_IDS = 'ui';

export const REDIS_PERMISSION_NAME = (name: Permission) => `p:${name}`;

export const REDIS_PERMISSION_ID = (id: number) => `pId:${id}`;

export const REDIS_ORGANIZATION_MEMBERS = (organization_id: number) => `om:${organization_id}`;
