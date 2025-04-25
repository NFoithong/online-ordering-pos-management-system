import { Router, Request, Response } from 'express';
import { loadMenuData } from '../utils/menuDataLoader';
import { CartItem } from '../models/cartItem';

const router = Router();

// Reorder endpoint
router.post('/reorder', async (req: Request, res: Response) => {
  const { items } = req.body as { items: CartItem[] };

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Invalid reorder items' });
  }

  // You could validate against the menu data if needed:
  const menuData = await loadMenuData();
  const validItems = items.map(cartItem => {
    const menuItem = menuData.find(m => m.id === cartItem.id);
    return menuItem ? { ...cartItem, price: menuItem.price } : null;
  }).filter(item => item !== null);

  res.status(200).json({ message: 'Reorder successful', items: validItems });
});

export default router;
