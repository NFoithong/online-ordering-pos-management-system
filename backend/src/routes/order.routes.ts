import { Router, Request, Response } from 'express';
import { loadOrders, saveOrders } from '../utils/orderDataLoader';
import { v4 as uuid } from 'uuid';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
// Store SSE clients
const clients: Response[] = [];


// SSE endpoint
router.get('/stream', (req: Request, res: Response) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.flushHeaders();
  
    clients.push(res);
  
    // Remove disconnected clients
    req.on('close', () => {
      const index = clients.indexOf(res);
      if (index !== -1) clients.splice(index, 1);
    });
  });
// GET /api/orders - List orders
// router.get('/', (req: Request, res: Response) => {
//   const orders = loadOrders();
//   res.json(orders);
// });
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
    // Access user info from token:
    const user = req.user;
    res.json({ message: `Hello ${user?.role}`, user });
  });
  

// GET /api/orders/:id - Get order detail
router.get('/:id', async (req: Request, res: Response) => {
  const orders = await loadOrders();
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// POST /api/orders - Create new order
router.post('/', async (req: Request, res: Response) => {
  const orders = await loadOrders();
  const newOrder = { id: uuid(), date: new Date(), ...req.body };
  orders.push(newOrder);
  saveOrders(orders);
  res.status(201).json(newOrder);
});

router.get('/orders/stream', (req, res) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
  
    const sendOrder = (order: { id: number; total: number; createdAt: Date; }) => {
      res.write(`data: ${JSON.stringify(order)}\n\n`);
    };
  
    // Simulate sending a new order every 5s (replace with real-time order logic)
    const interval = setInterval(() => {
      const dummyOrder = { id: Date.now(), total: Math.random() * 100, createdAt: new Date() };
      sendOrder(dummyOrder);
    }, 5000);
  
    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  });
  

export default router;
