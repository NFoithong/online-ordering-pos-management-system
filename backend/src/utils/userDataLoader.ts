import fs from 'fs';
import path from 'path';
import { User } from '../models/user';

const filePath = path.join(__dirname, '../data/users.json');

export const loadUserData = (): User[] => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as User[];
};
