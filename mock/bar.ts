import { Request, Response } from 'express';
import { mock } from 'mockjs';
import { waitTime } from './user';

const getBasicBarData = async (req: Request, res: Response) => {
  await waitTime(2000);
  res.json(
    mock({
      'data|26-26': [
        {
          name: /[a-z]/,
          'value|1-100.1-2': 100,
        },
      ],
    }),
  );
};

export default {
  'GET /api/basic-data': getBasicBarData,
};
