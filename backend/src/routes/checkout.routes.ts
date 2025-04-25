import { Router, Request, Response } from 'express';
import { stripe } from '../configs/stripe'; // Your Stripe instance

const router = Router();

// POST /api/checkout
router.post('/checkout', async (req: Request, res: Response) => {
  const { items } = req.body;

  // Calculate total amount from cart items (in cents)
  const amount = items.reduce((total: number, item: any) => {
    return total + item.item.price * item.quantity * 100; // Convert to cents
  }, 0);

  try {
    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description: 'Order payment',
    });

    // Send back the clientSecret
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

export default router;
