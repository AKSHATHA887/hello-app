import { heartbeat } from '../../../src/controllers/heartbeat';
import { Request, Response } from 'express';

let req: Request;
let res: Response;

describe('heartbeat', () => {
  beforeEach(() => {
    req = {
      path: 'testUrl',
    } as unknown as Request;
    res = {
      send: () => {
        return 200;
      },
    } as unknown as Response;
  });

  it('should call successfully with proper message', async () => {
    res.send = jest.fn().mockReturnThis();
    await heartbeat(req, res);
    expect(res.send).toHaveBeenCalledWith('Evergreen NodeJS is running successfully !');
    jest.fn().mockReset();
  });
});
