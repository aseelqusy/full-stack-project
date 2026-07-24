"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const auth_1 = __importDefault(require("../middleware/auth"));
const store = new order_1.OrderStore();
const currentOrderByUser = async (req, res) => {
    const userId = Number(req.params.user_id);
    const order = await store.currentOrderByUser(userId);
    res.json(order);
};
const create = async (req, res) => {
    const order = {
        user_id: Number(req.body.user_id),
        status: req.body.status || 'active'
    };
    if (Number.isNaN(order.user_id)) {
        res.status(400).json('user_id is required');
        return;
    }
    const newOrder = await store.create(order);
    res.json(newOrder);
};
const addProduct = async (req, res) => {
    const quantity = Number(req.body.quantity);
    const orderId = Number(req.params.id);
    const productId = Number(req.body.product_id);
    if (Number.isNaN(quantity) || Number.isNaN(orderId) || Number.isNaN(productId)) {
        res.status(400).json('quantity, order_id, and product_id are required');
        return;
    }
    const product = await store.addProduct(quantity, orderId, productId);
    res.json(product);
};
const orderRoutes = (app) => {
    app.get('/orders/users/:user_id/current', auth_1.default, currentOrderByUser);
    app.post('/orders', auth_1.default, create);
    app.post('/orders/:id/products', auth_1.default, addProduct);
};
exports.default = orderRoutes;
