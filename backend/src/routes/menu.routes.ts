// import { Router, Request, Response } from 'express';
// import { v4 as uuid } from 'uuid';
// import { MenuItem } from '../models/menuItem';
// import { loadMenuData, saveMenuData } from '../utils/menuDataLoader';

// const router = Router();

// // GET all
// router.get('/', (_req: Request, res: Response) => {
//   const menuData = loadMenuData();
//   res.json(menuData);
// });

// // GET by ID
// router.get('/:id', (req: Request, res: Response) => {
//   const menuData = loadMenuData();
//   const item = menuData.find(i => i.id === req.params.id);
//   if (!item) {
//     return res.status(404).json({ message: 'Not found' });
//   } else {
//     return res.json(item);
//   }
  
// });

// // POST create
// router.post('/', (req: Request, res: Response) => {
//   const menuData = loadMenuData();
//   const newItem: MenuItem = {
//     id: uuid(),
//     ...req.body
//   };
//   menuData.push(newItem);
//   saveMenuData(menuData);
//   res.status(201).json(newItem);
// });

// // PUT update
// router.put('/:id', (req: Request, res: Response) => {
//   const menuData = loadMenuData();
//   const idx = menuData.findIndex(i => i.id === req.params.id);
//   if (idx === -1) return res.status(404).json({ message: 'Not found' });

//   menuData[idx] = { ...menuData[idx], ...req.body };
//   saveMenuData(menuData);
//   res.json(menuData[idx]);
// });

// // DELETE
// router.delete('/:id', (req: Request, res: Response) => {
//   let menuData = loadMenuData();
//   const idx = menuData.findIndex(i => i.id === req.params.id);
//   if (idx === -1) return res.status(404).json({ message: 'Not found' });

//   menuData.splice(idx, 1);
//   saveMenuData(menuData);
//   res.status(204).send();
// });

// export default router;
// import { Router, Request, Response } from 'express';
// import { v4 as uuid } from 'uuid';
// import { MenuItem } from '../models/menuItem';
// import { loadMenuData, saveMenuData } from '../utils/menuDataLoader';
// import { searchMenuItems } from '../services/spoonacular.service'; // ← added

// const router = Router();

// // GET all
// router.get('/', (_req: Request, res: Response) => {
//   const menuData = loadMenuData();
//   return res.json(menuData);
// });

// // GET by ID
// router.get('/:id', (req: Request, res: Response) => {
//   const menuData = loadMenuData();
//   const item = menuData.find(i => i.id === req.params.id);
//   if (!item) {
//     return res.status(404).json({ message: 'Not found' });
//   }
//   return res.json(item);
// });

// // POST create
// router.post('/', (req: Request, res: Response) => {
//   const menuData = loadMenuData();
//   const newItem: MenuItem = {
//     id: uuid(),
//     ...req.body
//   };
//   menuData.push(newItem);
//   saveMenuData(menuData);
//   return res.status(201).json(newItem);
// });

// // PUT update
// router.put('/:id', (req: Request, res: Response) => {
//   const menuData = loadMenuData();
//   const idx = menuData.findIndex(i => i.id === req.params.id);
//   if (idx === -1) {
//     return res.status(404).json({ message: 'Not found' });
//   }
//   menuData[idx] = { ...menuData[idx], ...req.body };
//   saveMenuData(menuData);
//   return res.json(menuData[idx]);
// });

// // DELETE
// router.delete('/:id', (req: Request, res: Response) => {
//   let menuData = loadMenuData();
//   const idx = menuData.findIndex(i => i.id === req.params.id);
//   if (idx === -1) {
//     return res.status(404).json({ message: 'Not found' });
//   }
//   menuData.splice(idx, 1);
//   saveMenuData(menuData);
//   return res.status(204).send();
// });

// // 🔍 GET /menu/search/:query — Fetch from Spoonacular API
// router.get('/search/:query', async (req: Request, res: Response) => {
//   const query = req.params.query;

//   try {
//     const items = await searchMenuItems(query);
//     if (!items.length) {
//       return res.status(404).json({ message: 'No items found' });
//     }
//     return res.json(items);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error fetching from external API' });
//   }
// });

// export default router;

// import { Router, Request, Response } from 'express';
// import { searchMenuItems } from '../services/spoonacular.service';

// const router = Router();

// // GET dynamic items from Spoonacular
// // router.get('/', async (req: Request, res: Response) => {
// //   const query = req.query.q || 'pizza'; // Default to pizza if no query
// //   const items = await searchMenuItems(String(query));
// //   return res.json(items);
// // });


// // router.get('/image', async (req: Request, res: Response) => {
// //   const query = req.query.q || 'food';
// //   const items = await searchMenuItems(String(query));
  
// //   if (items.length > 0) {
// //     return res.json({ imageUrl: items[0].imageUrl });
// //   } else {
// //     return res.json({ imageUrl: 'https://via.placeholder.com/400x300.png?text=No+Image' });
// //   }
// // });


// router.get('/searchByName/:name', async (req: Request, res: Response) => {
//   const name = decodeURIComponent(req.params.name); // Decode here
//   const items = await searchMenuItems(name);
//   const matchedItem = items.find(i => i.name.toLowerCase() === name.toLowerCase());

//   if (matchedItem) {
//     return res.json(matchedItem);
//   } else {
//     return res.status(404).json({ message: 'Item not found' });
//   }
// });


// export default router;

import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { MenuItem } from '../models/menuItem';
import { loadMenuData, saveMenuData } from '../utils/menuDataLoader';
import { loadOrders, saveOrders } from '../utils/orderDataLoader'; // Order utilities
import { stripe } from '../configs/stripe';
import { CartItem } from '../models/cartItem'; // Define your CartItem type
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

// GET all menu items (with optional search)
router.get('/', async (req: Request, res: Response) => {
  const query = (req.query.q as string)?.toLowerCase();
  const menuData = await loadMenuData();

  if (query) {
    const filtered = menuData.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
    return res.json(filtered);
  }

  return res.json(menuData);
});

// GET menu item by ID
router.get('/:id', async (req: Request, res: Response) => {
  const menuData = await loadMenuData();
  const item = menuData.find(i => i.id === req.params.id);
  return item ? res.json(item) : res.status(404).json({ message: 'Item not found' });
});

// POST create new menu item
// router.post('/', async (req: Request, res: Response) => {
//   const menuData = await loadMenuData();
//   const newItem: MenuItem = {
//     id: uuid(),
//     ...req.body
//   };
//   menuData.push(newItem);
//   await saveMenuData(menuData);
//   res.status(201).json(newItem);
// });
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin'),  // Only admin can create menu items
  (req, res) => {
    // Create menu item logic
    res.json({ message: 'Menu item created' });
  }
);

router.post(
  '/checkout',
  authenticateToken,
  authorizeRoles('customer', 'admin'),  // Both customer & admin allowed
  (req, res) => {
    // Checkout logic
    res.json({ message: 'Checkout success' });
  }
);


// PUT update menu item
router.put('/:id', async (req: Request, res: Response) => {
  const menuData = await loadMenuData();
  const idx = menuData.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Item not found' });
  menuData[idx] = { ...menuData[idx], ...req.body };
  await saveMenuData(menuData);
  res.json(menuData[idx]);
});

// DELETE menu item
router.delete('/:id', async (req: Request, res: Response) => {
  const menuData = await loadMenuData();
  const idx = menuData.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Item not found' });
  menuData.splice(idx, 1);
  await saveMenuData(menuData);
  res.status(204).send();
});

// POST new order (used in Stripe flow)
router.post('/orders', async (req: Request, res: Response) => {
  const orders = await loadOrders(); // Ensure async read
  const newOrder = { id: uuid(), ...req.body }; // Add order id
  orders.push(newOrder);
  await saveOrders(orders);
  res.status(201).json(newOrder);
});

// router.post('/checkout', async (req, res) => {
//   try {
//     const items = req.body.items; // [{ item: { id, name, price }, quantity }]
//     const menuData = await loadMenuData();

//     // Calculate total based on server-side prices (not from client)
//     const totalAmount = items.reduce((sum: number, cartItem: any) => {
//       const item = menuData.find(i => i.id === cartItem.item.id);
//       if (item) {
//         return sum + item.price * cartItem.quantity;
//       }
//       return sum;
//     }, 0);

//     // Stripe expects amount in cents
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(totalAmount * 100),
//       currency: 'usd',
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (err) {
//     console.error('Stripe Checkout Error:', err);
//     res.status(500).json({ error: 'Failed to create payment intent' });
//   }
// });

router.post('/reorder', (req: Request, res: Response) => {
  const { items } = req.body as { items: CartItem[] };

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Invalid cart items' });
  }

  res.status(200).json({ message: 'Reorder successful', items });
});


export default router;
