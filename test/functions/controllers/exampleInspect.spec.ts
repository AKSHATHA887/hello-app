import { exampleInspectScope } from '../../../src/controllers/exampleInspect';
import { Request, Response } from 'express';

let req: Request;
let res: Response;

/**
create a mock scope object
*/
describe('scope example', () => {
  beforeEach(() => {
    req = {
      path: 'testUrl',
      authInfo: {
        scp: 'offline_access',
      },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.fn().mockReset();
  });

  it('should provide correct scope and obtain authorization', async () => {
    await exampleInspectScope(req, res);
    expect(res.json).toHaveBeenCalledWith({ name: 'Authorized Welcome!' });
  });

  it('should not provide correct scope and get 403 invalid scope', async () => {
    // set the scope to an invalid scope
    req.authInfo = {
      scp: 'test',
    };
    await exampleInspectScope(req, res);
    expect(res.json).toHaveBeenCalledWith({ error: 'Insufficient Scope' });
  });
});
