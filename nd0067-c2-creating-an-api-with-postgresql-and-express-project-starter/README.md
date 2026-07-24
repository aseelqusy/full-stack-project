# Storefront Backend Project

Storefront Backend is a Node.js, Express, TypeScript, and PostgreSQL API for products, users, and orders.

## Requirements

### Prerequisites

- Node.js
- Yarn
- PostgreSQL

### Environment Variables

Create a `.env` file in the project root with the following values:

- `POSTGRES_HOST`
- `POSTGRES_DB`
- `POSTGRES_TEST_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `ENV`
- `BCRYPT_PASSWORD`
- `SALT_ROUNDS`
- `TOKEN_SECRET`

### Setup

Install dependencies:

```bash
yarn
```

Run migrations:

```bash
yarn db-migrate up
```

### Running the API

Start the development server:

```bash
yarn watch
```

### Testing

Run the test suite:

```bash
yarn test
```

## Database Connection

The application uses `src/database.ts` to connect to PostgreSQL. It selects `POSTGRES_TEST_DB` when `ENV=test`, otherwise it uses `POSTGRES_DB`.

## Implemented Endpoints

- `GET /products`
- `GET /products/:id`
- `POST /products` [JWT]
- `GET /users` [JWT]
- `GET /users/:id` [JWT]
- `POST /users`
- `POST /users/authenticate`
- `GET /orders/users/:user_id/current` [JWT]
- `POST /orders` [JWT]
- `POST /orders/:id/products` [JWT]

## Notes

- Passwords are hashed with bcrypt before storage.
- The API is CORS enabled.
- Model tests and endpoint tests are included under `tests/`.
