// models/cartItem.ts

export interface CartItem {
    id: string;              // MenuItem ID
    name: string;            // MenuItem Name
    price: number;           // MenuItem Price
    quantity: number;        // Quantity in cart
    imageUrl?: string;       // Optional image for cart display
  }
  