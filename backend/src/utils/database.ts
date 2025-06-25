export function toCamelCase(snakeCase: string) {
  const [first, ...rest] = snakeCase.split('_');

  return first + rest.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

export function camelCaseify<T2 extends object>(object: object): T2 {
  if (typeof object != 'object') throw new Error("Argument to be camelCaseified wasn't an object");

  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [toCamelCase(key), value]),
  ) as T2;
}

type NullableStringOrNumber = string | number | undefined | null;

/**
 * Usage:
 *
 * ```js
 * const [set, args] = getSqlPatchColumns([["name", name], ["country_code", countryCode]], organizationId);
 * pool.query(`UPDATE organization SET ${set} WHERE organization_id = ${args.length}`, args);
 * ```
 *
 * This function assumes that null or undefined values aren't allowed.
 *
 * @param map  Array of pairs of SQL column names keys to value values
 * @param extraArgs Extra arguments to the string formatter
 * @returns Pair of a string of the SET part of the SQL UPDATE statement,
 * and an array of values to pass to the pg package query array of argument values
 */
export function getSqlPatchColumns(
  map: [string, NullableStringOrNumber][],
  ...extraArgs: NullableStringOrNumber[]
): [string, NullableStringOrNumber[]] {
  map = map.filter(([, value]) => value != null);

  const columnSetters = map.map(([key], index) => `${key} = $${index + 1}`).join(', ');
  const args = map.map(([, value]) => value).concat(extraArgs);

  return [columnSetters, args];
}
