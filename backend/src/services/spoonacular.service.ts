// // import axios from 'axios';
// // import { MenuItem } from '../models/menuItem';
// // import dotenv from 'dotenv';

// // dotenv.config();

// // const API_KEY = process.env.SPOONACULAR_API_KEY;
// // const BASE_URL = 'https://api.spoonacular.com';

// // export async function searchMenuItems(query: string): Promise<MenuItem[]> {
// //   try {
// //     // const response = await axios.get<{ menuItems: any[] }>(
// //     //     `${BASE_URL}/food/menuItems/search`,
// //     //     {
// //     //       params: {
// //     //         query,
// //     //         number: 5,
// //     //         apiKey: API_KEY
// //     //       }
// //     //     }
// //     //   );   
// //     const response = await axios.get(`${BASE_URL}/food/menuItems/search`, {
// //         params: {
// //           query,
// //           number: 5,
// //           apiKey: API_KEY
// //         }
// //       }) as { data: { menuItems: any[] } };
         

// //     const items = response.data.menuItems.map((item: any, index: number) => ({
// //       id: `${item.id}-${index}`,
// //       name: item.title,
// //       description: item.restaurantChain || 'Auto-generated item',
// //       price: Math.floor(Math.random() * 20 + 5), // random price for demo
// //       category: query,
// //       imageUrl: item.image,
// //       available: true
// //     }));

// //     return items;
// //   } catch (error) {
// //     console.error('Error fetching data from Spoonacular:', error);
// //     return [];
// //   }
// // }


// import axios from 'axios';
// import { MenuItem } from '../models/menuItem';
// import dotenv from 'dotenv';

// dotenv.config();

// const API_KEY = process.env.SPOONACULAR_API_KEY;
// const BASE_URL = 'https://api.spoonacular.com';

// // Define response type for Spoonacular API
// interface SpoonacularResponse {
//   menuItems: {
//     id: number;
//     title: string;
//     image: string;
//     restaurantChain: string;
//   }[];
// }

// export async function searchMenuItems(query: string): Promise<MenuItem[]> {
//   try {
//     const response = await axios.get<SpoonacularResponse>(`${BASE_URL}/food/menuItems/search`, {
//       params: {
//         query,
//         number: 5,
//         apiKey: API_KEY
//       }
//     });

//     const items = response.data.menuItems.map((item, index) => {
//       // Optional: Generate resized image URL
//       const imageUrl = item.image
//         ? item.image.replace('/menuItemImages/', '/menuItemImages/240x150/')
//         : 'https://placehold.co/400x300?text=No+Image';

//       return {
//         id: `${item.id}-${index}`,
//         name: item.title,
//         description: item.restaurantChain || 'Auto-generated item',
//         price: Math.floor(Math.random() * 20 + 5), // Random price (demo)
//         category: query,
//         imageUrl: imageUrl,
//         available: true
//       } as MenuItem;
//     });

//     return items;
//   } catch (error: any) {
//     console.error('Error fetching data from Spoonacular:', error?.response?.data || error.message);
//     return [];
//   }
// }
