import { Request, Response } from 'express';
import controller from '../../../src/controllers/values';

let req: Request;
let res: Response;

describe('values', () => {
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

  it('should return values', async () => {
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();

    await controller.getValues(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: ['value1', 'value2'] });

    jest.fn().mockReset();
  });

  it('should return input value', async () => {
    const mockReq = (id) => {
      return {
        params: { id: id },
      } as unknown as Request;
    };
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();

    await controller.getValue(mockReq(9), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 9 });

    jest.fn().mockReset();
  });

  it('should succeed for add', async () => {
    res.status = jest.fn().mockReturnThis();

    await controller.addValue(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    jest.fn().mockReset();
  });

  it('should succeed for delete', async () => {
    res.status = jest.fn().mockReturnThis();

    await controller.deleteValue(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    jest.fn().mockReset();
  });

  it('should succeed for update', async () => {
    res.status = jest.fn().mockReturnThis();

    await controller.updateValue(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    jest.fn().mockReset();
  });
});
