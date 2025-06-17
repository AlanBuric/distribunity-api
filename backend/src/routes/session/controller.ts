import { Request, Response } from 'express';
import type { AuthorizedLocals } from '../../types/data-transfer-objects.js';
import { addTokenToDenylist } from './service.js';
import { StatusCodes } from 'http-status-codes';

export async function logoutUser(request: Request, response: Response<any, AuthorizedLocals>) {
  const accessToken = request.header('Authorization')?.split(' ')[1];
  const refreshToken = request.headers.cookie?.split('=')?.[1];

  response.clearCookie('refresh');

  if (refreshToken) await addTokenToDenylist(refreshToken);
  if (accessToken) await addTokenToDenylist(accessToken);

  response.sendStatus(StatusCodes.NO_CONTENT);
}
