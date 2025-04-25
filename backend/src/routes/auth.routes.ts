import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { loadUserData } from '../utils/userDataLoader';
import { User } from '../models/user';

const router = Router();

// Dummy users (replace with database lookup in real app)
const users = [
    { id: '1', username: 'admin', password: 'adminpass', role: 'admin' },
    { id: '2', username: 'customer', password: 'customerpass', role: 'customer' }
  ];
  
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';  // Use env in production

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  const users = loadUserData();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

export default router;
