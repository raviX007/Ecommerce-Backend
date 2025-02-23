import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./Category";
import { CartItem } from "./CartItem";
import { OrderItem } from "./OrderItem";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @Column()
    stock: number;

    @Column({ nullable: true })
    imageUrl: string;

    @ManyToOne(() => Category, category => category.products)
    category: Category;

    @OneToMany(() => CartItem, cartItem => cartItem.product)
    cartItems: CartItem[];

    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    orderItems: OrderItem[];
}