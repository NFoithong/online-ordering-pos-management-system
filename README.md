# 🍽️ Online Ordering & POS Management System

An interactive **Rich Internet Application (RIA)** designed for restaurants and cafés to manage **customer orders**, **menu items**, **venue layouts**, and **point-of-sale (POS)** operations. Built with **Angular**, **Ionic**, **Node.js**, and enriched with **modern Web APIs** for seamless desktop and mobile experiences.


## 🚀 Features

### 👨‍🍳 Admin Panel
- **Menu Editor**: Create, edit, upload images, and categorize menu items.
- **POS Dashboard**: View **real-time incoming orders** using **Server-Sent Events (SSE)**.
- **Venue Layout Designer**: Design table layouts with **HTML5 Canvas** and **drag-and-drop**.
- **Inventory Management**: Track stock levels and receive low-inventory alerts.
- **Reporting Module**: Access total sales, top items, and order trends.

### 👥 Customer Experience
- **Menu Browsing & Filtering**: Explore categorized menu items with rich visuals.
- **Cart & Checkout**: Add/remove items, view totals, and checkout securely with **Stripe**.
- **Favorites**: Save preferred items for easy access. *(Planned)*
- **Reorder History**: View and reorder past orders with a single click.
- **Geolocation Delivery**: Auto-fill delivery address based on user's coordinates.
- **Offline Ordering**: Queue orders when offline and submit when back online. *(Planned)*


## 🧠 Technology Stack

### Frontend
- **Angular** (Primary UI framework)
- **Ionic** (Cross-platform mobile responsiveness)
- **TypeScript** (Strict typing)
- **HTML5 Canvas**, **Drag-and-Drop API**, **Web Storage**, **Web Workers**, **Geolocation API**

### Backend
- **Node.js** + **Express**
- **Server-Sent Events (SSE)** for real-time order tracking
- **Stripe Checkout API** for payment processing
- **Local JSON** (MVP data persistence; upgradeable to Firebase/MongoDB)


## 🔐 Authentication & Access Control
- **Role-based login system**: Admin, Customer.
Hardcoded users for testing:
- Admin:
    - Username: admin
    - Password: password
- Customer:
    - Username: customer
    - Password: password

- **Angular Guards**: Restrict routes based on user roles.
- **JWT Authentication** for secure sessions.


## 📦 Deployment

- **Frontend**: Firebase Hosting *(planned)*.
- **Backend**: Render/Railway *(planned)*.


## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/NFoithong/online-ordering-pos-management-system.git  
cd online-ordering-pos-management-system
```

### 2️⃣ Install dependencies
Frontend (Angular + Ionic):

```bash 
cd frontend  
npm install  
ionic serve
```
Backend (Node.js + Express):

```bash 
cd backend  
npm install  
nodemon --watch "src/**/*.ts" --exec ts-node src/server.ts
```

### 3️⃣ Environment Variables
Create a .env file in the backend directory:

env
```bash
PORT=5000   
STRIPE_SECRET_KEY=sk_test_...
```

### 4️⃣ Run
- Frontend: ionic serve
- Backend: npm run dev

## 📊 Future Enhancements
- Inventory Management: Track stock quantities and auto-alerts.
- Reporting Module: Sales trends, top-selling items.
- Offline Ordering: Enable Web Workers to queue orders offline.
- OAuth Integration: Support for Google/Facebook login.
- Deployment: Firebase (frontend) and Render (backend) with CI/CD pipelines.

## 📄 License
- This project is licensed under the MIT License.
- Let me know if you’d like to add **API routes**, **screenshots**, or **example user credentials** to this! 🚀
