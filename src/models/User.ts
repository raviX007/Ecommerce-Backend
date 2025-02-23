import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import { CartItem } from "./CartItem";
import { Order } from "./Order";
import * as bcrypt from "bcrypt";
import { UserRole } from "../types/auth.types";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  // Hash password only before insert
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Add a separate method for password updates
  async updatePassword(newPassword: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(newPassword, salt);
  }

  // Helper method to check password
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Helper method to get full name
  getFullName(): string {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
  }

  // Helper method to get cart items count
  async getCartItemsCount(): Promise<number> {
    return this.cartItems?.length || 0;
  }

  // Helper method to get orders count
  async getOrdersCount(): Promise<number> {
    return this.orders?.length || 0;
  }
}
