import { Request, Response } from 'express';

export default function handleHealthcheck(request: Request, response: Response) {
  response.send('OK');
}
