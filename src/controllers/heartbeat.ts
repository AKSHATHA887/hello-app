import { Request, Response } from 'express';

export function heartbeat(req: Request, res: Response): void {
  // console.log(`{"heartbeat": "${req.path}"}`);
  res.send('Evergreen NodeJS is running successfully !');
}
