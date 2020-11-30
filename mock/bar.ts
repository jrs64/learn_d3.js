import { Request, Response } from 'express';
import { mock } from 'mockjs';

const getBasicBarData = (req: Request, res: Response) => {
  res.json(
    mock({
      "data|26-26": [{
        "name": /[a-z]/,
        "value|1-100.1-2": 100
      }]
    })
  )
};

export default {
  'GET /api/basic-data': getBasicBarData
}