import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity("cart_items")
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.cartItems)
    user: User;

    @ManyToOne(() => Product, product => product.cartItems)
    product: Product;

    @Column()
    quantity: number;

    @Column("decimal", { precision: 10, scale: 2 })
    priceAtAdd: number;

    @CreateDateColumn()
    createdAt: Date;
}