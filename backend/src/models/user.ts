export interface User {
    id: string;
    username: string;
    password: string;  // Store hashed passwords in production
    role: 'admin' | 'customer';
  }
  