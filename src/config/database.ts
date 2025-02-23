import 'dotenv/config';
import { DataSource } from "typeorm";
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { CartItem } from '../models/CartItem';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [ User, Product, Category, CartItem, Order, OrderItem],
    synchronize: true,
    logging: true,
    ssl: {
        rejectUnauthorized: false 
    }
});