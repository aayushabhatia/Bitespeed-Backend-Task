// /routes/identify.ts
import express from 'express';
import { Request, Response } from 'express'; 
import { identifyUser } from '../logic/identify';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    res.status(400).json({ error: 'email or phoneNumber required' });
    return;
  }

  try {
    const response = await identifyUser({ email, phoneNumber });
    res.status(200).json({ contact: response });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
});

export default router;
