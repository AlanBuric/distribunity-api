import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import getDatabase from '../../services/database.js';
import type { AuthorizedLocals } from '../../types/data-transfer-objects.js';
import type { Country } from '../../types/database-types.js';
import { camelCaseify } from '../../utils/database.js';

export async function getFilteredCountries(
  request: Request,
  response: Response<Country[], AuthorizedLocals>,
) {
  const { filter } = matchedData<{ filter: string }>(request);

  const { rows } = filter
    ? await getDatabase().query(`SELECT * FROM country WHERE country_name ILIKE '%' || $1 || '%'`, [
        filter,
      ])
    : await getDatabase().query('SELECT * FROM country');

  response.send(rows.map(camelCaseify<Country>));
}
