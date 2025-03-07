### Inventory Management System

A comprehensive inventory management solution with a Next.js frontend and FastAPI backend.

## Overview

This Inventory Management System provides businesses with a powerful tool to track inventory, manage products, handle orders, and analyze business performance. The system features a modern, responsive UI built with Next.js and a robust backend API powered by FastAPI.

## Features

- **Dashboard**: Real-time overview of key business metrics
- **Inventory Management**: Track stock levels, set alerts for low inventory
- **Product Catalog**: Manage product information and pricing
- **Order Processing**: Create and track customer orders
- **Supplier Management**: Manage supplier relationships and performance
- **Shipment Tracking**: Create and monitor product shipments
- **Customer Management**: Track customer information and purchase history
- **Payment Processing**: Record and manage payment transactions
- **Analytics**: Comprehensive business analytics and reporting

## Authentication and Role-Based Access Control

### User Authentication

The system implements a simple authentication mechanism using username and contact information. Users are stored in the database with the following attributes:

- `id`: Primary key
- `name`: User's name
- `contact_info`: Contact information (email, phone, etc.)
- `role`: User's role (admin, customer, supplier)

### User Roles and Permissions

The system supports three user roles with different access levels:

#### Admin Role
- Full access to all system features
- Can manage inventory, products, customers, orders, suppliers, shipments, analytics, and payments
- Can view and modify all data in the system

#### Customer Role
- Limited access to system features
- Can view products
- Can view and manage their own orders
- Can access the dashboard with limited information

#### Supplier Role
- Limited access to system features
- Can view products
- Can view and manage orders related to them
- Can view and manage shipments related to them
- Can access the dashboard with limited information

### Page Access by Role

| Page/Feature | Admin | Customer | Supplier |
|--------------|-------|----------|----------|
| Dashboard    | ✅    | ✅       | ✅       |
| Inventory    | ✅    | ❌       | ❌       |
| Products     | ✅    | ✅       | ✅       |
| Customers    | ✅    | ❌       | ❌       |
| Orders       | ✅    | ✅       | ✅       |
| Suppliers    | ✅    | ❌       | ❌       |
| Shipments    | ✅    | ❌       | ✅       |
| Analytics    | ✅    | ❌       | ❌       |
| Payments     | ✅    | ❌       | ❌       |

### Backend API Endpoints for Authentication

The backend provides the following API endpoints for authentication:

- `POST /api/v1/auth/login` - Authenticate a user
  - Request body: `{ "username": "string", "contact_info": "string" }`
  - Response: `{ "user": { "id": number, "name": "string", "contact_info": "string", "role": "string" }, "token": "string" }`


## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Charts**: Recharts


### Backend

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **Database Driver**: psycopg2
- **Environment Variables**: python-dotenv
- **Validation**: Pydantic


## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- PostgreSQL


### Frontend Setup

1. Clone the repository:


```shellscript
git clone https://github.com/Jannatul-2003/Inventory-Management-System-for-Healthcare.git
```

2. Install dependencies:


```shellscript
npm install
# or
yarn install
```

3. Create a `.env.local` file in the frontend directory:


```plaintext
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

4. Start the development server:


```shellscript
npm run dev
# or
yarn dev
```

5. Access the application at `http://localhost:3000`


### Backend Setup

1. Navigate to the backend directory:


```shellscript
cd ../backend
```

2. Create and activate a virtual environment:


```shellscript
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:


```shellscript
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:


```plaintext
DATABASE_URL=postgresql://username:password@localhost/inventory_db
```
5. Set up the backend project structure using the provided PowerShell script:


```shellscript
 powershell -ExecutionPolicy Bypass -File create_project_structure.ps1
```

6. Start the FastAPI server:


```shellscript
uvicorn app.main:app --reload
```

7. Access the API at `http://localhost:8000`


## Project Structure

### Frontend Structure

```plaintext
frontend/
├── app/                    # Next.js App Router
|   └── {dashboard}/        
│   ├── analytics/          # Analytics pages
│   ├── customers/          # Customer management pages
│   ├── inventory/          # Inventory management pages
│   ├── orders/             # Order management pages
│   ├── payments/           # Payment processing pages
│   ├── products/           # Product catalog pages
│   ├── shipments/          # Shipment tracking pages
│   ├── suppliers/          # Supplier management pages
│   └── layout.tsx          # Root layout
|   └── ui/
|        └── page.tsx                
├── components/             # Reusable React components
│   ├── dashboard-header.tsx
│   ├── dashboard-nav.tsx
│   ├── dashboard-shell.tsx
│   ├── overview.tsx
│   ├── recent-sales.tsx
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utility functions and services
│   ├── api.ts              # API client
│   ├── services/           # Service modules for API calls
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
|   └── auth-context.ts        
└── public/                 # Static assets
```

### Backend Structure

```plaintext
backend/
├── app/
│   ├── api/                # API endpoints
│   │   ├── v1/             # API version 1
│   │   │   ├── endpoints/  # API route handlers
│   │   │   │      ├── analytics.py
│   │   │   │      ├── auth.py
│   │   │   │      ├── customer.py
│   │   │   │      ├── dashboard.py
│   │   │   │      ├── inventory.py
│   │   │   │      ├── order.py
│   │   │   │      ├── payment.py
│   │   │   │      ├── product.py
│   │   │   │      ├── shipment.py
│   │   │   │      |── supplier.py
│   │   │   │      ├── user.py
│   │   │   └── router.py   # API router
│   ├── config/             # Application configuration
│   │   ├── __init__.py
│   │   └── database.py     # Database configuration
│   ├── repositories/       # Data access layer
│   │   ├── __init__.py
│   │   ├── analytics_repo.py
│   │   ├── user_repo.py
│   │   ├── customer_repo.py
│   │   ├── dashboard_repo.py
│   │   ├── inventory_repo.py
│   │   ├── order_repo.py
│   │   ├── payment_repo.py
│   │   ├── product_repo.py
│   │   ├── shipment_repo.py
│   │   └── supplier_repo.py
│   ├── schemas/            # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── analytics.py
│   │   ├── auth.py
│   │   ├── customer.py
│   │   ├── dashboard.py
│   │   ├── inventory.py
│   │   ├── order.py
│   │   ├── payment.py
│   │   ├── product.py
│   │   ├── shipment.py
│   │   └── supplier.py
│   │   ├── user.py
│   ├── services/           # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   ├── utils/              # Utility functions
│   │   ├── __init__.py
│   │   └── database_utils.py
│   ├── __init__.py
│   └── main.py             # Application entry point
├── alembic/                # Database migrations
│   └── versions/
├── tests/                  # Test cases
│   ├── test_api/
│   ├── test_repositories/
│   ├── test_services/
│   └── __init__.py
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── alembic.ini             # Alembic configuration
├── requirements.txt        # Python dependencies
└── README.md               # Project documentation
```

## API Endpoints

The backend provides the following API endpoints:

### Products

- `POST /api/v1/auth/login` - Authenticate a user with username and contact information


### Products

- `GET /api/v1/products` - List all products
- `POST /api/v1/products` - Create a new product
- `GET /api/v1/products/{product_id}` - Get product details
- `PUT /api/v1/products/{product_id}` - Update a product
- `DELETE /api/v1/products/{product_id}` - Delete a product


### Inventory

- `GET /api/v1/inventory` - List all inventory items
- `GET /api/v1/inventory/alerts` - Get low stock alerts
- `GET /api/v1/inventory/{product_id}` - Get inventory for a product
- `PUT /api/v1/inventory/{product_id}` - Update inventory for a product


### Orders

- `GET /api/v1/orders` - List all orders
- `POST /api/v1/orders` - Create a new order
- `GET /api/v1/orders/summary` - Get order summary
- `GET /api/v1/orders/status` - Get order status summary
- `GET /api/v1/orders/{order_id}` - Get order details
- `GET /api/v1/orders/{order_id}/details` - Get order line items
- `PUT /api/v1/orders/{order_id}` - Update an order
- `DELETE /api/v1/orders/{order_id}` - Delete an order


### Customers

- `GET /api/v1/customers` - List all customers
- `POST /api/v1/customers` - Create a new customer
- `GET /api/v1/customers/vip` - Get VIP customers
- `GET /api/v1/customers/{customer_id}` - Get customer details
- `GET /api/v1/customers/{customer_id}/orders` - Get customer order history
- `PUT /api/v1/customers/{customer_id}` - Update a customer
- `DELETE /api/v1/customers/{customer_id}` - Delete a customer


### Suppliers

- `GET /api/v1/suppliers` - List all suppliers
- `POST /api/v1/suppliers` - Create a new supplier
- `GET /api/v1/suppliers/performance` - Get supplier performance metrics
- `GET /api/v1/suppliers/{supplier_id}` - Get supplier details
- `PUT /api/v1/suppliers/{supplier_id}` - Update a supplier
- `DELETE /api/v1/suppliers/{supplier_id}` - Delete a supplier


### Payments

- `GET /api/v1/payments` - List all payments
- `POST /api/v1/payments` - Create a new payment
- `GET /api/v1/payments/analysis` - Get payment analysis
- `GET /api/v1/payments/{payment_id}` - Get payment details


### Shipments

- `GET /api/v1/shipments` - List all shipments
- `POST /api/v1/shipments` - Create a new shipment
- `GET /api/v1/shipments/late` - Get late shipments
- `GET /api/v1/shipments/{shipment_id}` - Get shipment details
- `PUT /api/v1/shipments/{shipment_id}` - Update a shipment
- `DELETE /api/v1/shipments/{shipment_id}` - Delete a shipment


### Analytics

- `GET /api/v1/analytics/sales` - Get sales analytics
- `GET /api/v1/analytics/products` - Get product analytics
- `GET /api/v1/analytics/customers` - Get customer analytics
- `GET /api/v1/analytics/suppliers` - Get supplier analytics
- `GET /api/v1/analytics/trends` - Get trend analytics


### Dashboard

- `GET /api/v1/dashboard/overview` - Get dashboard overview
- `GET /api/v1/dashboard/monthly` - Get monthly metrics
- `GET /api/v1/dashboard/top-products` - Get top products
- `GET /api/v1/dashboard/top-customers` - Get top customers


## Backend Implementation Details

### Database Models

The FastAPI backend uses PostgreSQL with the following main models:

- **Product**: Product information and pricing
- **Inventory**: Stock levels and status
- **Order**: Order header information
- **OrderDetail**: Order line items
- **Customer**: Customer information
- **Supplier**: Supplier information
- **Payment**: Payment transactions
- **Shipment**: Shipment information
- **ShipmentDetail**: Shipment line items


### Data Validation

All API requests and responses are validated using Pydantic models, ensuring data integrity and type safety.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Pydantic](https://pydantic-docs.helpmanual.io/)
