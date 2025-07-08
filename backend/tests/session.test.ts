import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { isEligibleForRefresh } from '../src/routes/session/service';
import EnvConfig from '../src/utils/config';

beforeAll(() => {
  EnvConfig.REFRESH_TOKEN_EXPIRATION = '14d';
  EnvConfig.TOKEN_LIFETIME_REFRESH_THRESHOLD = 0.75;
});

describe('isEligibleForRefresh', () => {
  const now = Date.now();
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

  beforeEach(() => vi.setSystemTime(now));

  it.each([
    Math.floor((now - 2 * 24 * 60 * 60 * 1000) / 1000),
    Math.floor((now - 10 * 24 * 60 * 60 * 1000) / 1000),
    Math.floor((now - fourteenDaysMs * 0.75) / 1000 + 1),
  ])(
    'returns false because less than 75% of refresh token lifetime has passed for IAT %d',
    (iat) => {
      expect(isEligibleForRefresh(iat)).toBe(false);
    },
  );

  it('returns true because more than 75% of refresh token lifetime has passed', () => {
    const iat = Math.floor((now - 11 * 24 * 60 * 60 * 1000) / 1000);

    expect(isEligibleForRefresh(iat)).toBe(true);
  });

  it('returns true if exactly 75% of refresh token lifetime has passed', () => {
    const iat = Math.floor((now - fourteenDaysMs * 0.75) / 1000);

    expect(isEligibleForRefresh(iat)).toBe(true);
  });
});
