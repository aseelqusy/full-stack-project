# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index: `GET /products`
- Show: `GET /products/:id`
- Create [token required]: `POST /products`
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)

#### Users

- Index [token required]: `GET /users`
- Show [token required]: `GET /users/:id`
- Create: `POST /users`
- Authenticate: `POST /users/authenticate`

#### Orders

- Current Order by user (args: user id) [token required]: `GET /orders/users/:user_id/current`
- Create order [token required]: `POST /orders`
- Add product to order [token required]: `POST /orders/:id/products`
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

#### User

- id
- firstName
- lastName
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Database Tables

#### products

- id: serial primary key
- name: varchar(100) not null
- price: integer not null
- category: varchar(100) nullable

#### users

- id: serial primary key
- first_name: varchar(100) not null
- last_name: varchar(100) not null
- password_digest: varchar not null

#### orders

- id: serial primary key
- user_id: integer foreign key references users(id)
- status: varchar(20) not null

#### order_products

- id: serial primary key
- order_id: integer foreign key references orders(id)
- product_id: integer foreign key references products(id)
- quantity: integer not null
