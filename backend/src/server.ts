import express, { Request, Response } from 'express';
import cors from 'cors';
import { PORT } from './configs/config';
import menuRoutes from './routes/menu.routes';
import checkoutRoutes from './routes/checkout.routes';
import orderRoutes from './routes/order.routes';
import locationRoutes from './routes/location.routes'; // Adjust path
import cartRoutes from './routes/cart.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add auth routes
app.use('/api/auth', authRoutes);

// REST endpoints
app.use('/menu', menuRoutes);

app.use('/api', checkoutRoutes);
app.use('/api/orders', orderRoutes); // Protected by authMiddleware
app.use('/api/location', locationRoutes); // This mounts /api/location/reverse-geocode
app.use('/api/cart', cartRoutes);


// Health check
// app.get('/', (_req: Request, res: Response) => res.send('API is running'));

// --- SSE setup for real-time orders ---
let sseClients: Response[] = [];

app.get('/orders/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();

  sseClients.push(res);
  req.on('close', () => {
    sseClients = sseClients.filter(c => c !== res);
  });
});

// Broadcast helper (call this inside your order-creation logic)
export function broadcastOrder(order: any) {
  const payload = `data: ${JSON.stringify(order)}\n\n`;
  sseClients.forEach(client => client.write(payload));
}

// Simulate incoming orders (for demo)
import { v4 as uuid } from 'uuid';
import { loadOrders, saveOrders } from './utils/orderDataLoader';
setInterval(() => {
  const newOrder = {
    id: uuid(),
    total: Math.floor(Math.random() * 50) + 10,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  const orders = loadOrders();
  orders.push(newOrder);
  saveOrders(orders);
  broadcastOrder(newOrder);
}, 20000); // Every 20 seconds


app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
