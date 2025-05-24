import database from "../services/database.js";
import type { Country } from "../types/database-types.js";
import { camelCaseify } from "../utils/database.js";

type CachedUser = {
  organizationIds: Set<number>;
};

type Cache = {
  users: Map<number, CachedUser>;
  countries: Map<string, Country>;
};

const cache: Cache = {
  users: new Map(),
  countries: new Map(),
};

export async function initializeCache() {
  await database
    .query("SELECT * FROM country")
    .then(({ rows }) =>
      rows
        .map<Country>(camelCaseify)
        .forEach((country) => cache.countries.set(country.countryCode, country))
    );
}

async function initializeUser(userId: number) {
  const { rows } = await database.query<{ organization_id: number }>(
    "SELECT organization_id FROM organization_member WHERE user_id = $1;",
    [userId]
  );
  const user = {
    organizationIds: new Set(rows.map((row) => row.organization_id)),
  };

  cache.users.set(userId, user);

  return user;
}

export async function getUser(userId: number): Promise<CachedUser | undefined> {
  const user = cache.users.get(userId);

  if (!user) {
    await initializeUser(userId);
    return undefined;
  }

  return user;
}

export function getCountry(countryCode: string) {
  return cache.countries.get(countryCode);
}

export function getCountries() {
  return cache.countries.values();
}

export async function addUserOrganizationId(
  userId: number,
  organizationId: number
): Promise<CachedUser> {
  const user = cache.users.get(userId);

  if (!user) {
    return await initializeUser(userId);
  }

  user.organizationIds.add(organizationId);

  return user;
}
