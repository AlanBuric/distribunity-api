import { Request, Response } from 'express';
import getDatabase from '../../services/database.js';
import { matchedData } from 'express-validator';
import { camelCaseify } from '../../utils/database.js';
import { Country } from '../../types/database-types.js';
import type { AuthorizedLocals } from '../../types/data-transfer-objects.js';
import { StatusCodes } from 'http-status-codes';

export async function getFilteredCountries(
  request: Request,
  response: Response<Country[], AuthorizedLocals>,
) {
  const { filter } = matchedData<{ filter: string }>(request);

  const { rows } = await getDatabase().query(
    `SELECT * FROM country WHERE country_name ILIKE '%' || $1 || '%'`,
    [filter],
  );

  response.send(rows.map(camelCaseify<Country>));
}

export async function addEmailToNewsletter(
  request: Request,
  response: Response<Country[], AuthorizedLocals>,
) {
  const { email } = matchedData<{ email: string }>(request);

  // TODO add to database
  response.sendStatus(StatusCodes.OK);
}
