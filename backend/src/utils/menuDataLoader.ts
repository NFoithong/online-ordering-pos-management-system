// import fs from 'fs';
// import path from 'path';
// import { MenuItem } from '../models/menuItem';

// const filePath = path.join(__dirname, '../data/menu.json');

// // Read data from file
// export function loadMenuData(): MenuItem[] {
//     try {
//         if (!fs.existsSync(filePath)) {
//           fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
//         }
    
//         const json = fs.readFileSync(filePath, 'utf-8');
//         return JSON.parse(json);
//       } catch (error) {
//         console.error('Error loading menu data:', error);
//         return [];
//       }
//     }

// // Write data to file
// export function saveMenuData(data: MenuItem[]) {
//   try {
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
//   } catch (error) {
//     console.error('Error saving menu data:', error);
//   }
// }
import fs from 'fs/promises';
import path from 'path';
import { MenuItem } from '../models/menuItem';

const filePath = path.join(__dirname, '../data/menu.json');

// Read data from file (async)
export async function loadMenuData(): Promise<MenuItem[]> {
  try {
    // Check if file exists, if not create it
    await fs.access(filePath).catch(async () => {
      await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf-8');
    });

    const json = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(json) as MenuItem[];
  } catch (error) {
    console.error('Error loading menu data:', error);
    return [];
  }
}

// Write data to file (async)
export async function saveMenuData(data: MenuItem[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving menu data:', error);
  }
}
