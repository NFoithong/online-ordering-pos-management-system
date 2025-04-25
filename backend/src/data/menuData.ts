import { MenuItem } from '../models/menuItem';

const menuData: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic cheese & tomato',
    price: 12.5,
    category: 'Pizza',
    imageUrl: 'https://unsplash.com/photos/freshly-baked-delicious-pizza-on-wooden-table-original-italian-food-background-pizza-concept-gi2aexB9X3Y',
    available: true
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan',
    price: 8.0,
    category: 'Salad',
    imageUrl: 'https://source.unsplash.com/400x300/?salad',
    available: true
  }
];

export default menuData;
