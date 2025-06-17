import type { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import type { ErrorResponse, OrganizationLocals } from '../../../types/data-transfer-objects.js';
import type { Item } from '../../../types/database-types.js';
import { camelCaseify } from '../../../utils/database.js';
import getDatabase from '../../../services/database.js';

export async function PATCH(
  request: Request,
  response: Response<ErrorResponse | Item, OrganizationLocals>,
): Promise<any> {
  const { itemId, name, unit, iconUrl, unitPrice, attributes } = matchedData<
    Partial<Item> & { itemId: number }
  >(request);

  const { rows, rowCount } = await getDatabase().query(
    `UPDATE item
     SET
       name = COALESCE($2, name),
       unit = COALESCE($3, unit),
       icon_url = COALESCE($4, icon_url),
       unit_price = COALESCE($5, unit_price),
       attributes = COALESCE($6, attributes),
       updated_at = now()
     WHERE item_id = $1
     RETURNING *`,
    [itemId, name, unit, iconUrl, unitPrice, attributes],
  );

  if (rowCount) {
    response.send(camelCaseify<Item>(rows[0]));
  }

  response.status(StatusCodes.NOT_FOUND);
}

export async function POST(
  request: Request,
  response: Response<ErrorResponse | { id: number }, OrganizationLocals>,
): Promise<any> {
  const { inventoryId, name, unit, iconUrl, unitPrice, attributes } = matchedData<any>(request);

  const client = await getDatabase().connect();

  try {
    await client.query('BEGIN');

    const itemResult = await client.query(
      `INSERT INTO item (name, unit, icon_url, unit_price, attributes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING item_id`,
      [name, unit, iconUrl, unitPrice, attributes],
    );
    const itemId = itemResult.rows[0].item_id;

    await client.query(
      `INSERT INTO inventory_item (inventory_id, item_id, quantity)
       VALUES ($1, $2, 0)`,
      [inventoryId, itemId],
    );

    await client.query('COMMIT');
    response.status(StatusCodes.CREATED).send({ id: itemId });
  } catch (error: any) {
    await client.query('ROLLBACK');

    if (error.code === '23505') {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .send(`Item with the name ${name} already exists`);
    }

    throw error;
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: Request,
  response: Response<ErrorResponse, OrganizationLocals>,
): Promise<any> {
  const { itemId, inventoryId } = matchedData<{
    itemId: number;
    inventoryId: number;
  }>(request);

  const { rowCount } = await getDatabase().query(
    'DELETE FROM inventory_item WHERE item_id = $1 AND inventory_id = $2',
    [itemId, inventoryId],
  );

  if (!rowCount) {
    return response.status(StatusCodes.NOT_FOUND).send(`Item with ID ${itemId} not found`);
  }

  await getDatabase().query(
    `DELETE FROM item WHERE item_id = $1 AND NOT EXISTS (
      SELECT 1 FROM inventory_item WHERE item_id = $1
    )`,
    [itemId],
  );

  response.sendStatus(StatusCodes.OK);
}
