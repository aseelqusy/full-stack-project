"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require("../database"));
class OrderStore {
    async create(order) {
        const conn = await database_1.default.connect();
        try {
            const sql = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
            const result = await conn.query(sql, [order.user_id, order.status]);
            return result.rows[0];
        }
        finally {
            conn.release();
        }
    }
    async currentOrderByUser(user_id) {
        const conn = await database_1.default.connect();
        try {
            const orderQuery = 'SELECT * FROM orders WHERE user_id = $1 AND status = $2 ORDER BY id DESC LIMIT 1';
            const orderResult = await conn.query(orderQuery, [user_id, 'active']);
            if (!orderResult.rows.length) {
                return null;
            }
            const order = orderResult.rows[0];
            const productsQuery = `
        SELECT p.id, p.name, p.price, p.category, op.quantity
        FROM order_products op
        INNER JOIN products p ON p.id = op.product_id
        WHERE op.order_id = $1
        ORDER BY p.id
      `;
            const productsResult = await conn.query(productsQuery, [order.id]);
            return {
                id: order.id,
                user_id: order.user_id,
                status: order.status,
                products: productsResult.rows
            };
        }
        finally {
            conn.release();
        }
    }
    async addProduct(quantity, order_id, product_id) {
        const conn = await database_1.default.connect();
        try {
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [quantity, order_id, product_id]);
            return result.rows[0];
        }
        finally {
            conn.release();
        }
    }
}
exports.OrderStore = OrderStore;
