import { AppDataSource } from "../config/database";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { CartService } from "./cart.service";

export class OrderService {
  private orderRepository = AppDataSource.getRepository(Order);
  private orderItemRepository = AppDataSource.getRepository(OrderItem);
  private cartService = new CartService();

  async createOrder(userId: number): Promise<Order> {
    const cartItems = await this.cartService.getCart(userId);

    const order = this.orderRepository.create({
      user: { id: userId },
      totalAmount: cartItems.reduce(
        (sum, item) => sum + item.priceAtAdd * item.quantity,
        0
      ),
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems = cartItems.map((cartItem) =>
      this.orderItemRepository.create({
        order: savedOrder,
        product: cartItem.product,
        quantity: cartItem.quantity,
        priceAtOrder: cartItem.priceAtAdd,
      })
    );

    await this.orderItemRepository.save(orderItems);

    await this.cartService.clearCart(userId);

    return savedOrder;
  }

  async getUserOrders(userId: number) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ["orderItems", "orderItems.product"],
    });
  }

  async getOrderById(orderId: number, userId: number): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ["orderItems", "orderItems.product"],
    });
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = await this.orderRepository.findOneOrFail({
      where: { id: orderId },
    });
    order.status = status;
    return this.orderRepository.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ["orderItems", "orderItems.product", "user"],
    });
  }

  async cancelOrder(orderId: number, userId: number): Promise<void> {
    const order = await this.orderRepository.findOneOrFail({
      where: { id: orderId, user: { id: userId } },
    });
    order.status = "cancelled";
    await this.orderRepository.save(order);
  }
}
