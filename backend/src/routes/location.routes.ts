import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

router.get('/reverse-geocode', async (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Missing lat or lon' });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { format: 'json', lat, lon },
      headers: { 'User-Agent': 'YourApp (your@email.com)' },
    });
    res.json(response.data);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: any }, message?: string };
      res.status(500).json({
        message: 'Reverse geocoding failed',
        error: axiosError.response?.data || axiosError.message || 'Unknown error'
      });
    } else {
      res.status(500).json({
        message: 'An unexpected error occurred'
      });
    }
  }
});

export default router;
