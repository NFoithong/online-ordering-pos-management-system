import fs from 'fs';
import path from 'path';

const ordersFile = path.join(__dirname, '../data/order.json');

export const loadOrders = (): any[] => {
  if (!fs.existsSync(ordersFile)) return [];
  const data = fs.readFileSync(ordersFile, 'utf8');
  return JSON.parse(data || '[]');
};

export const saveOrders = (orders: any[]): void => {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
};
