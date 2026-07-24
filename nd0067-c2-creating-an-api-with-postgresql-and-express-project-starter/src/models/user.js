"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = parseInt(process.env.SALT_ROUNDS);
class UserStore {
    async index() {
        const conn = await database_1.default.connect();
        const result = await conn.query('SELECT id, first_name, last_name FROM users');
        conn.release();
        return result.rows;
    }
    async show(id) {
        const conn = await database_1.default.connect();
        const result = await conn.query('SELECT id, first_name, last_name FROM users WHERE id=($1)', [id]);
        conn.release();
        return result.rows[0];
    }
    async create(user) {
        const conn = await database_1.default.connect();
        const hash = bcrypt_1.default.hashSync(user.password + pepper, saltRounds);
        const sql = 'INSERT INTO users (first_name, last_name, password_digest) VALUES ($1, $2, $3) RETURNING id, first_name, last_name';
        const result = await conn.query(sql, [user.first_name, user.last_name, hash]);
        conn.release();
        return result.rows[0];
    }
    async authenticate(first_name, password) {
        const conn = await database_1.default.connect();
        const sql = 'SELECT * FROM users WHERE first_name=($1)';
        const result = await conn.query(sql, [first_name]);
        conn.release();
        if (result.rows.length) {
            const user = result.rows[0];
            if (bcrypt_1.default.compareSync(password + pepper, user.password_digest)) {
                return user;
            }
        }
        return null;
    }
}
exports.UserStore = UserStore;
