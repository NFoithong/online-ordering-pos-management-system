import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';  // Use extended request with user info

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    next();
  };
}
