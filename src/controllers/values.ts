import { Request, Response, NextFunction } from 'express';

const getValues = async (req: Request, res: Response) => {
  const values: string[] = ['value1', 'value2'];
  return res.status(200).json({
    message: values,
  });
};

const getValue = async (req: Request, res: Response) => {
  // get the id from the req
  const value: string = req.params.id;
  return res.status(200).json({
    message: value,
  });
};

const updateValue = async (req: Request, res: Response) => {
  return res.status(200);
};

const deleteValue = async (req: Request, res: Response) => {
  return res.status(200);
};

// adding a post
const addValue = async (req: Request, res: Response) => {
  return res.status(200);
};

export default { getValues, getValue, updateValue, deleteValue, addValue };
