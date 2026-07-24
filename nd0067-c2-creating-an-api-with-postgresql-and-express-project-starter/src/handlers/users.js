"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const auth_1 = __importDefault(require("../middleware/auth"));
const store = new user_1.UserStore();
const index = async (_req, res) => {
    const users = await store.index();
    res.json(users);
};
const show = async (req, res) => {
    const user = await store.show(req.params.id);
    res.json(user);
};
const create = async (req, res) => {
    const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password
    };
    const newUser = await store.create(user);
    const token = jsonwebtoken_1.default.sign({ user: newUser }, process.env.TOKEN_SECRET);
    res.json(token);
};
const authenticate = async (req, res) => {
    const user = await store.authenticate(req.body.first_name, req.body.password);
    if (!user) {
        res.status(401).json('Invalid username or password');
        return;
    }
    const token = jsonwebtoken_1.default.sign({ user }, process.env.TOKEN_SECRET);
    res.json(token);
};
const userRoutes = (app) => {
    app.get('/users', auth_1.default, index);
    app.get('/users/:id', auth_1.default, show);
    app.post('/users', create);
    app.post('/users/authenticate', authenticate);
};
exports.default = userRoutes;
